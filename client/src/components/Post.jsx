import React from 'react'
import { Link } from 'react-router-dom';

function Post( {_id,title, summary, content, cover , createdAt ,author}) {
  const date = new Date(createdAt);
  return (
    <article className="overflow-hidden  border border-gray-100 bg-[#EEE6CA] shadow-xs w-[380px]">
  <img
    alt=""
    src={`http://localhost:3000/${cover}`}
    className="h-56 w-full object-cover"
  />

  <div className="p-4 sm:p-6">
    <a href="#">
      <h3 className="text-lg font-medium text-[#896C6C]">
        {title}
      </h3>
    </a>

    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-800">
      {summary} 
    </p>

    <Link to={`/post/${_id}`} className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#896C6C]">
      Find out more

      <span aria-hidden="true" className="block transition-all group-hover:ms-0.5 rtl:rotate-180">
        &rarr;
      </span>
    </Link>
  </div>
</article>
  )
}

export default Post
