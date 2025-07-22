"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    NProgress.start();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      NProgress.done();
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'An unknown error occurred.');
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#13151a] p-8 rounded-2xl shadow-lg border border-gray-800">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold flex items-center justify-center space-x-2">
            <Image src="/logo.png" alt="Wanzami Logo" width={32} height={32} />
            <span className="font-bold text-xl text-white">Wanzami</span>
        </Link>
        <p className="text-gray-400 mt-2">Register to enjoy the features</p>
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300" htmlFor="username">Username</label>
          <input id="username" name="username" type="text" required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-orange" placeholder="yourusername" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-orange" placeholder="you@example.com" />
        </div>

        <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
            <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-orange" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="confirm-password">Confirm Password</label>
            <div className="relative">
                <input id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-orange" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
        
        <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-theme-orange focus:ring-theme-orange" />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                I agree to our <Link href="/privacy" className="text-theme-orange hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-theme-orange hover:underline">Term & Conditions</Link>
            </label>
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-theme-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-orange transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50">
            {isLoading ? 'Registering...' : 'Continue'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-theme-orange hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
