import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`http://localhost:3000/post/${id}`);
      setPost(response.data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 relative">
      <div
        className="bg-cover bg-center text-center overflow-hidden"
        style={{
          minHeight: '500px',
          backgroundImage: `url(http://localhost:3000/${post.cover.replace(/\\/g, '/')})`
        }}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mt-3 rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
          <div className="bg-[#EEE6CA] relative top-0 -mt-32 p-5 sm:p-10">
            <h1 className="text-[#896C6C] font-bold text-3xl mb-2">{post.title}</h1>
            <p className="text-gray-700 text-xs mt-2">
              Written By:
              <span className="text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                { post.author?.username}
              </span>
             

            </p>
            {userInfo.id === post.author?._id && (
              <Link className="absolute top-0 right-0 mt-4 mr-4 text-sm text-gray-800 hover:text-gray-900" to={`/edit/${post._id}`}>
                Edit
              </Link>
            )}

           

            <div
              className="text-base text-gray-800 leading-8 my-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

          </div>

        </div>
      </div>
    </div>
  );
}
