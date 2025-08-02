'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from 'lucide-react' // ✅ Lucide icons (you can also use other icons)
import api from '@/utils/api'
import { useAuth } from '@/context/AuthContext.js'
import Link from "next/link"

export default function SignupPage() {
    const {setIsLoggedIn} = useAuth()
    const router = useRouter();
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [error, seterror] = useState('')
    const [showpassword, setshowpassword] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/signup', { name, email, password })
            setIsLoggedIn(true)
            router.push('/');
        } catch (error) {
            console.error('Signup failed:', error);
            seterror(error?.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className=" my-14 flex items-center justify-center">
            <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                    required
                />
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

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded  hover:bg-blue-700">
                    Sign Up
                </button><p className="text-sm mt-3">
                    Already have an account? <Link href="/login" className="text-blue-600 underline">Login</Link>
                </p>
            </form>
        </div>
    );


}