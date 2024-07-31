require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const User = require('./modals/User');
const Post = require('./modals/Post');
const secret = process.env.SECRET;
const salt = bcrypt.genSaltSync(10);

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))
const uploadMiddleware = multer({ dest: 'uploads/' });

mongoose.connect(`${process.env.MONGODB_URI}`)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({ username, password: bcrypt.hashSync(password, salt) });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json('wrong credentials');
        }
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { httpOnly: true }).json({
                    id: userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json('wrong credentials');
        }
    } catch (e) {
        res.status(400).json(e);
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

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path: tempPath } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = `${tempPath}.${ext}`;
    fs.renameSync(tempPath, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json('Invalid token');
        const { title, summary, content } = req.body;
        try {
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });
            res.json(postDoc);
        } catch (e) {
            console.error('Error saving post:', e);
            res.status(500).json({ error: 'Error saving post' });
        }
    });
});

app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find().populate('author',['username']).sort({createdAt: -1}).limit(20);
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const postDoc = await Post.findById(id).populate('author', ['username']);
        if (!postDoc) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(postDoc);
    } catch (e) {
        res.status(500).json({ error: 'Error fetching post' });
    }
});
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        try {
            const postDoc = await Post.findById(id);
            if (!postDoc) return res.status(404).json('Post not found');

            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            if (!isAuthor) {
                return res.status(403).json('You are not the author');
            }

            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            if (newPath) postDoc.cover = newPath;

            await postDoc.save(); 
            res.json(postDoc);
        } catch (e) {
            console.error('Error updating post:', e);
            res.status(500).json({ error: 'Error updating post' });
        }
    });
});

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
