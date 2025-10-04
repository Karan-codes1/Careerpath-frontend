'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useAuth } from '@/context/AuthContext.js'


export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout')
            setIsLoggedIn(false);
            router.push('/')
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50 bg-">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="mb-2 text-2xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text  decoration-indigo-300">
                        CareerPath
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link href="/" className="text-gray-700 hover:text-[#008080] font-medium">Home</Link>
                        {isLoggedIn && (
                            <>
                                <Link href="/profile" className="text-gray-700 hover:text-[#008080] font-medium">Profile</Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white text-gray-700 hover:text-[#008080] px-4 py-2 rounded-md text-sm transition duration-150"
                                >
                                    Logout
                                </button> 
                            </>
                        )}

                        {!isLoggedIn && (
                            <>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="bg-white text-gray-700 hover:bg-gray-100 hover:text-[#008080] px-4 py-2 rounded-md text-sm transition duration-150"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() => router.push('/signup')}
                                    className="bg-[#008080] hover:bg-[#006666] text-white px-4 py-2 rounded-md text-sm transition duration-150"
                                >
                                    Sign Up
                                </button>

                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 px-4 pb-4' : 'max-h-0 px-4 pb-0'
                        }`}
                >
                    <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</Link>
                    <Link href="/explore" className="block py-2 text-gray-700 hover:text-blue-600">Explore</Link>
                    {isLoggedIn && (
                        <>
                            <Link href="/profile" className="block py-2 text-gray-700 hover:text-blue-600">Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="w-full mt-2 bg-white text-gray-700 hover:text-blue-600 py-2 rounded-md text-sm transition duration-150"
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {!isLoggedIn && (
                        <>
                            <Link href="/login">
                                <button className="w-full mt-2 bg-white text-gray-700 hover:bg-gray-100 hover:text-[#008080] py-2 rounded-md text-sm transition duration-150">
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="w-full mt-2 bg-[#008080] hover:bg-[#008080] text-white py-2 rounded-md text-sm transition duration-250">
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>

            )}
        </nav>
    )
}
