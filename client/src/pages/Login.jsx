import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import logo from '../assets/logo.png'
export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUserInfo } = useContext(UserContext)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(
        'http://localhost:3000/login',
        { username, password },
        { withCredentials: true }
      )
      setUserInfo(response.data)
      setRedirect(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Error logging in')
    } finally {
      setLoading(false)
    }
  }

  if (redirect) return <Navigate to="/" />

  return (
    <div className="flex min-h-[90vh] flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={logo}
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-[#896C6C]">
          Login to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-[#896C6C]">
              Username
            </label>
            <div className="mt-2">
              <input
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#896C6C] sm:text-sm/6"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-[#896C6C]">
                Password
              </label>
              
            </div>
            <div className="mt-2">
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#896C6C] sm:text-sm/6"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-[#896C6C] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#E5BEB5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-[#E5BEB5] disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#896C6C] hover:text-[#E5BEB5]">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
