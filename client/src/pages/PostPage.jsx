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
    <div>
        <time>{formatISO9075(new Date(postInfo.createdAt)) }</time>
        <div>by {postInfo.author.username}</div>
        {userInfo.id === postInfo.author._id && (
            <div>
              <Link to={`/edit/${postInfo._id}`}>edit this post</Link>
            </div>
        )}
      <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      <h1>{postInfo.title}</h1>
      <div dangerouslySetInnerHTML={{__html:postInfo.content}}/>
    </div>
  )
}

export default PostPage
