import React, { useContext, useState } from 'react';
import {Navigate} from 'react-router-dom'
import { UserContext } from '../UserContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false)
  const {setUserInfo} = useContext(UserContext)
  async function login(ev){
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if(response.ok){
        response.json().then(userInfo => {
          setUserInfo(userInfo);
          setRedirect(true);
        })
    }else{
      alert('wrong credentials')
    }
  }
  if(redirect){
      return <Navigate to={'/'}/>
  }
  return (
    
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
<div className="sm:mx-auto sm:w-full sm:max-w-sm">
  <img
    alt="Your Company"
    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
    className="mx-auto h-10 w-auto"
  />
  <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
    Login to your account
  </h2>
</div>

<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
  <form action="" onSubmit={login} className="space-y-6">
    <div>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
        Name
      </label>
      <div className="mt-2">
        <input
           type="text"
           placeholder="username"
           value={username}
           onChange={(ev) => setUsername(ev.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          Password
        </label>
        
      </div>
      <div className="mt-2">
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Login
      </button>
    </div>
  </form>

</div>
</div>
    

  )
}



export default LoginPage
