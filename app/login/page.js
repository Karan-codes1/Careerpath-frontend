'use client'
// 1. Import Suspense along with your other React/Next.js imports
// The import for useState and useEffect now correctly includes Suspense.
import { useState, useEffect, Suspense } from "react" 
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import { useAuth } from '@/context/AuthContext.js'
import { useSearchParams } from 'next/navigation';
import api from '@/utils/api'

// 2. Rename your original component to contain the client-side logic
function LoginContent() { 
    const { setIsLoggedIn } = useAuth()
    const router = useRouter();
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [error, seterror] = useState('')
    const [showpassword, setshowpassword] = useState(false)

    // The problematic hook is here:
    const searchParams = useSearchParams(); 
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'login_required') {
            setPopupMessage('Please login or create an account to access the roadmap.');
            setShowPopup(true);

            const timer = setTimeout(() => setShowPopup(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);


    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const res = await api.post('/auth/login', { email, password });
            setIsLoggedIn(true)
            router.push('/')

        } catch (error) {
            console.error('Login failed:', error);
            seterror(error?.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className=" my-14 overflow-hidden flex items-center justify-center">

            {showPopup && (
                <div className="my-10 absolute top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow z-50 transition-all">
                    {popupMessage}
                </div>
            )}


            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                {error && <p className="text-red-500">{error}</p>}

                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                    required
                />

                {/* Password Input */}
                <div className="relative mb-3">
                    <input
                        type={showpassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        className="w-full p-2 border rounded pr-10"
                        required
                    />
                    <span
                        onClick={() => setshowpassword(!showpassword)}
                        className="absolute top-2 right-3 cursor-pointer text-gray-600"
                    >
                        {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>

                {/* Login Button */}
                <button type="submit" className="w-full bg-[#008080] text-white p-2 rounded hover:bg-[#006666]">
                    Login
                </button>
                <p className="text-sm mt-3">
                    Don’t have an account? <Link href="/signup" className="text-blue-600 underline">Sign up</Link>
                </p>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        // The Suspense wrapper ensures the component using useSearchParams 
        // is skipped during server prerendering.
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}