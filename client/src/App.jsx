
import './App.css'
import Navbar from './components/Navbar'
import Post from './components/Post'
import {Route, Routes} from 'react-router-dom' 
import Login from './pages/Login'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'
import { UserContextProvider } from './UserContext'
import IndexPage from './pages/IndexPage'
import PostPage from './pages/PostPage'
import EditPost from './pages/EditPost'
import Footer from './components/Footer'
function App() {

  return (
    <UserContextProvider>

    <Navbar/>
    <Routes>
      <Route path="/" element={<IndexPage/>} />
      <Route path="/post" element={<Post/>} />
      <Route path="/create" element={<CreatePost/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/post/:id" element={<PostPage/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/edit/:id" element={<EditPost/>} />
    </Routes>
    <Footer/>
    </UserContextProvider>
  

  )
}

export default App
