import './App.css'
import Header from './Header'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Post from './Post'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import { UserContextProvider } from './UserContext'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
function App() {

  return (
    <BrowserRouter>
    <UserContextProvider>
    <Header/>
    <Routes>
    <Route path="/" element={<IndexPage/>} />
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/register" element={<RegisterPage/>} />
    <Route path="/create" element={<CreatePost/>}/>
    {/* <Route path="/post/:id" element={<PostPage/>}/> */}
    </Routes>
    </UserContextProvider>
    </BrowserRouter>
  )
}

export default App
