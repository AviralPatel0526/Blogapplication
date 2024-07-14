import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function PostPage() {
    const {id} = useParams();
    const [postInfo,setPostInfo]=useState(null)
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
        dfkvkndfkvndfk
      <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      <h1>{postInfo.title}</h1>
    </div>
  )
}

export default PostPage
