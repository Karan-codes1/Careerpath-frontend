'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import api from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/signup", { name, email, password });

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Signup successful, but login failed");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-14 flex justify-center">
      <form onSubmit={handleSignup} className="bg-white p-6 w-96 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mb-3 p-2 border"
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 p-2 border"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 p-2 border"
        />

        <button
          disabled={loading}
          className="w-full bg-[#008080] text-white p-2 rounded"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full mt-4 bg-red-500 text-white p-2 rounded"
        >
          Signup with Google
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
