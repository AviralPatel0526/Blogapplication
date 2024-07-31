import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div className='w-full h-auto justify-center flex pt-8'>
            <form className='w-[80vw] flex flex-col gap-4' onSubmit={createNewPost}>
                <input type="title" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)} className='h-[35px] border-[2px] border-gray-300 rounded-md' />
                <input type="summary" placeholder={'Summary'}
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)}
                    className='h-[35px] border-[2px] border-gray-300 rounded-md' />
                <input type="file" placeholder={'file'} onChange={ev => setFiles(ev.target.files)}/>
      <Editor value={content} onChange={setContent} />
      <button className='mt-10 w-[100%] p-2 bg-gray-700 rounded-md text-white hover:bg-gray-600'>Create Post</button>
    </form>
    </div>
  );
}