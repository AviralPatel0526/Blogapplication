import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import Post from '../components/Post';
function IndexPage() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
      const fetchPosts = async () => {
        const response = await axios.get('http://localhost:3000/post');
        const data = response.data;
        console.log(data);
        setPosts(data);
      };
      fetchPosts();
    }, []);
  return (
    <section className="bg-[#F5FAE1] min-h-[90vh]">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-[#896C6C] mb-4">
          Your Voice, Your Story, Your Blog
        </h1>
        <p className="text-lg text-gray-700">
          Blog Smarter. Reach Further
        </p>
      </div>

      <div className="px-8 py-10 flex flex-wrap justify-center gap-8 ">
        
          
    
        {posts.length > 0 && posts.map(post => (<Post key={post._id} {...post} />))}    
    
          

      </div>
    </section>
  )
}

export default IndexPage
