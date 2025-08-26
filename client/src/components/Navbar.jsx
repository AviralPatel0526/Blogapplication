import React from 'react'
import { use } from 'react';
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
function Navbar() {
    const { setUserInfo , userInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/profile', { withCredentials: true });
                setUserInfo(response.data);
            } catch (error) {
                setUserInfo({});
            }
        };
        fetchProfile();
    }, [location.pathname, setUserInfo]);
    async function handleLogout() {
        try {
            await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
            setUserInfo(null);
        } catch (error) {
            console.error(error);
        }
    }

    const username = userInfo?.username;
    return (
        <header className="bg-[#EEE6CA]">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <Link className=" gap-2 flex" to="/">
                    <span className="sr-only">Home</span>
                    <img src={logo} alt="Logo" className="h-10 w-10" />
                <span className='text-[#896C6C] text-3xl font-bold'>Bee</span>
                </Link>
                <div className="flex flex-1 items-center justify-end">
                    
                    <div className="flex items-center gap-4">
                        {username ? (
                        <div className="sm:flex sm:gap-4">
                            <Link
                                className="block  bg-[#896C6C] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#E5BEB5]"
                                to="/create"
                            >
                                Create Post
                            </Link>

                            <button
                                className="hidden bg-gray-100 px-5 py-2.5 text-sm font-medium text-[#896C6C] transition hover:text-[#E5BEB5] sm:block"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                        ) : (
                            <div className="sm:flex sm:gap-4">
                                <Link
                                    className="block  bg-[#896C6C] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#E5BEB5]"
                                    to="/login"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="hidden  bg-gray-100 px-5 py-2.5 text-sm font-medium text-[#896C6C] transition hover:text-[#E5BEB5] sm:block"
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        <button
                            className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
                        >
                            <span className="sr-only">Toggle menu</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
