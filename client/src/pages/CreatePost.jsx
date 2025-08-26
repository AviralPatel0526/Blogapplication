import React from 'react';
import axios from 'axios';
import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';

function CreatePost() {
  const editor = useRef(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState(''); 
  const [redirect, setRedirect] = useState(false);
  async function handleCreatePost(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('file', file);
    formData.append('content', content);
    try{
      const response = await axios.post('http://localhost:3000/post', formData ,
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 201) {
        // Post created successfully
        setRedirect(true);
      }
    }catch(err){
      console.error(err);
    }
  }
  if (redirect) {
    return <Navigate to={'/'} />;
  }
  return (
    <div className='w-[90vw] mx-auto h-[90vh] flex flex-col justify-center items-center'>
      <h1 className='text-3xl text-center font-bold text-[#896C6C]'>Create New Post</h1>
    <form onSubmit={handleCreatePost} className='flex mt-4 flex-col gap-4'>
        <input type="title" placeholder={'Title'} value={title} onChange={(e) => setTitle(e.target.value)} 
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#EEE6CA] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#896C6C] sm:text-sm/6"/>
        <input type="summary" placeholder={'Summary'} value={summary} onChange={(e) => setSummary(e.target.value)} 
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-[EEE6CA] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#896C6C] sm:text-sm/6"/>
        <input type="file"  onChange={(e) => setFile(e.target.files[0])} />
        <JoditEditor
          ref={editor}
          value={content}
          onChange={(newContent) => setContent(newContent)}
        />
        <button type="submit"
        className="mt-4 rounded-md bg-[#896C6C] px-4 py-2 text-white hover:bg-[#E5BEB5]">Create Post</button>
    </form>
    </div>
  )
}

export default CreatePost
