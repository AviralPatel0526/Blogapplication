import axios from 'axios';
import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
function EditPost() {
  const editor = useRef(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {id}=useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const postInfo = await axios.get(`http://localhost:3000/post/${id}`);
      setTitle(postInfo.data.title);
      setSummary(postInfo.data.summary);
      setContent(postInfo.data.content);
    };
    fetchPost();
  }, []);

  const handleEditPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }

    await axios.put(
      `http://localhost:3000/post/${id}`,
      formData,
      { withCredentials: true }
    );
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }
  return (
    <div className='w-[90vw] mx-auto min-h-[90vh] flex flex-col justify-center items-center'>
      <h1 className='text-3xl text-center font-bold text-[#896C6C]'>Edit Post</h1>
      <form onSubmit={handleEditPost} className='flex mt-4 flex-col gap-4'>
        <input type="title" placeholder={'Title'} value={title} onChange={(e) => setTitle(e.target.value)}
         className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#EEE6CA] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#896C6C] sm:text-sm/6"/>
        <input type="summary" placeholder={'Summary'} value={summary} onChange={(e) => setSummary(e.target.value)}
         className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#EEE6CA] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#896C6C] sm:text-sm/6"/>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />
      <button type="submit"
      className="mt-4 rounded-md bg-[#896C6C] px-4 py-2 text-white hover:bg-[#E5BEB5]">Update Post</button>
    </form>
    </div>
  )
}

export default EditPost
