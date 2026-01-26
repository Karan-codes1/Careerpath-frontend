'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const isLoggedIn = !!session;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="mb-2 text-2xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text">
            CareerPath
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-700 hover:text-[#008080] font-medium">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-[#008080] font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-gray-700 hover:text-[#008080] px-4 py-2 rounded-md text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-white text-gray-700 hover:bg-gray-100 hover:text-[#008080] px-4 py-2 rounded-md text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-[#008080] hover:bg-[#006666] text-white px-4 py-2 rounded-md text-sm"
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
        <div className="md:hidden px-4 pb-4">
          <Link href="/" className="block py-2 text-gray-700">Home</Link>

          {isLoggedIn ? (
            <>
              <Link href="/profile" className="block py-2 text-gray-700">Profile</Link>
              <button
                onClick={handleLogout}
                className="w-full mt-2 bg-white text-gray-700 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-gray-700">Login</Link>
              <Link href="/signup" className="block py-2 text-gray-700">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
