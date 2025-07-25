'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from 'lucide-react' // ✅ Lucide icons (you can also use other icons)
import Link from "next/link"
import api from '@/utils/api'

export default function LoginPage() {

    const router = useRouter();
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [error, seterror] = useState('')
    const [showpassword, setshowpassword] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()// Prevent page refresh

        try {
            const res = await api.post('/auth/login', { email, password }); // backend called using axios
            router.push('/dashboard')

        } catch (error) {
            console.error('Login failed:', error);
            seterror(error?.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                {error && <p className="text-red-500">{error}</p>}  {/* show error if any */}

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
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Login
                </button>
                <p className="text-sm mt-3">
                    Don’t have an account? <Link href="/signup" className="text-blue-600 underline">Sign up</Link>
                </p>
            </form>
        </div>
    );

}



