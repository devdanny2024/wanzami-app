"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NProgress from 'nprogress'; // Import NProgress

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerified = searchParams.get('verified');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    NProgress.start(); // Start the loader
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Login failed.');
      }

      router.push('/discover');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      NProgress.done(); // Stop the loader
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#13151a] p-8 rounded-2xl shadow-lg border border-gray-800">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold flex items-center justify-center space-x-2">
            <Image src="/images/logo.png" alt="Wanzami Logo" width={32} height={32} />
            <span className="font-bold text-xl text-white">Wanzami</span>
        </Link>
        <p className="text-gray-400 mt-2">Login to your account</p>
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-md text-sm">{error}</div>}
      {isVerified && <div className="mb-4 p-3 bg-theme-orange/20 border border-theme-orange text-orange-300 rounded-md text-sm">Your account has been verified! You can now log in.</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-300" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-orange" placeholder="you@example.com" />
        </div>

        <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="password">
                Password
            </label>
            <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-orange" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
        
        <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-theme-orange hover:underline">
                Forgot Password?
            </Link>
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-theme-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-orange transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-theme-orange hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
