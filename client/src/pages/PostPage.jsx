import { formatISO9075 } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../UserContext';

function PostPage() {
    const {id} = useParams();
    const [postInfo,setPostInfo]=useState(null)
    const {userInfo} = useContext(UserContext)
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`).then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo)
            })
        })
    },[])

    if(!postInfo) return ''
  return (
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
    <div className="max-w-3xl mx-auto">
        <div className="py-8 flex flex-col justify-between items-center text-center">
            <h1 className="text-3xl font-bold mb-2">{postInfo.title}</h1>
            <p className="text-gray-500 text-sm">Published on <time>{formatISO9075(new Date(postInfo.createdAt)) }</time> by {postInfo.author.username}</p>
            {userInfo.id === postInfo.author._id && (
            <div className='mt-6'>
              <Link to={`/edit/${postInfo._id}`} className='px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-md'>Edit this post</Link>
            </div>
        )}
        </div>

        <img src={`http://localhost:4000/${postInfo.cover}`} alt="Featured image" className="w-full h-auto mb-8"/>

        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto" dangerouslySetInnerHTML={{__html:postInfo.content}}>
           
        </div>
    </div>
</div>


  )
}


export default PostPage
