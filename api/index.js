import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import pg from 'pg';
import 'dotenv/config';
const app = express();
const saltRounds = 10;
const secret = process.env.JWT_SECRET;
const uploadMiddleware = multer({ dest: 'uploads/' });

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

const db = new pg.Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
db.connect();

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });
    jwt.sign({ username, id: user.id }, secret, (err, token) => {
      if (err) return res.status(500).json({ error: 'Token generation failed' });
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      }).json({ username, id: user.id });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Login failed' });
  }
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { title, summary, content } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json('Invalid token');
    try {
      await fs.promises.rename(path, newPath);
      const result = await db.query(
        'INSERT INTO posts (title, summary, content, cover, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, summary, content, newPath, info.id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Post creation failed' });
    }
  });
});

app.get('/post', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT posts.*, users.username AS author_username, users.id AS author_id
       FROM posts
       JOIN users ON posts.author_id = users.id
       ORDER BY posts.created_at DESC`
    );
    const posts = result.rows.map(row => ({
      ...row,
      _id: row.id, 
      author: { username: row.author_username, _id: row.author_id }
    }));
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not fetch posts' });
  }
});

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
  const { title, summary, content } = req.body;
  const { id } = req.params;
  let updateQuery = 'UPDATE posts SET title=$1, summary=$2, content=$3';
  const values = [title, summary, content];
  let idx = 4;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    await fs.promises.rename(path, newPath);
    updateQuery += `, cover=$${idx}`;
    values.push(newPath);
    idx++;
  }
  updateQuery += ` WHERE id=$${idx} RETURNING *`;
  values.push(id);

  try {
    const result = await db.query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Update failed' });
  }
});


app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT posts.*, users.username AS author_username, users.id AS author_id
       FROM posts
       JOIN users ON posts.author_id = users.id
       WHERE posts.id = $1`,
      [id]
    );
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Post not found' });
    const post = {
      ...row,
      _id: row.id, 
      author: { username: row.author_username, _id: row.author_id }
    };
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not fetch post' });
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json('Invalid token');
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json('ok');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

