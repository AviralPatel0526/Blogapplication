import React from 'react'
import Post from "../Post";
import {useEffect, useState} from "react";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div className='w-[98vw] justify-center flex'>
    <div className='xl:w-[70vw] w-[90vw]'>
    {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </div>
    </div>
  );
}