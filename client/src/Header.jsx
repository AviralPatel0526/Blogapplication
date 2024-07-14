import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './UserContext'

function Header() {
  const {userInfo,setUserInfo} = useContext(UserContext)
  useEffect(()=>{
     fetch('http://localhost:4000/profile',{
      credentials: 'include',
     }).then(response => {
        response.json().then(userInfo => {
          setUserInfo(userInfo)
        })
     }) 
  },[])
  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials: 'include',
      method: 'POST'
     })
     setUserInfo(null)
  }
  const username = userInfo?.username
  return (
    <header className='flex justify-between px-10 h-[10vh] items-center'>
        <Link to="/" className='font-bold text-xl'>MyBlog</Link>
        <nav className='flex gap-4'>
          {username && (
            <>
            <Link to="/create">Create new Post</Link>
            <a href="" onClick={logout}>logout</a>
            </>
          )}
          {!username && (
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
          )}
          
        </nav>
      </header>
  )
}

export default Header
