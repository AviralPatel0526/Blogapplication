import React from 'react'
import {format} from 'date-fns'
import { Link } from 'react-router-dom'
function Post({_id,title,summary,cover,content,createdAt,author}) {
  return (
    <div className='flex gap-5 justify-center p-8'>
        <div >
        <Link to={`/post/${_id}`}>
        <img src={'http://localhost:4000/'+cover} alt="" className='w-[500px]'/>
        </Link>
        </div>
        <div className='w-[30vw] flex flex-col gap-2'>
        <Link to={`/post/${_id}`}>
        <h2 className='text-2xl font-semibold'>{title}</h2>
        </Link>
        <div className='flex gap-2'>
        <a href="">{author.username}</a>
        <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
        </div>
        
        <p className='mt-8'>
         {summary}</p>
          </div>
      </div>
  )
}

export default Post
