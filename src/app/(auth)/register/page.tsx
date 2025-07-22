"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto bg-[#13151a] p-8 rounded-2xl shadow-lg border border-gray-800">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold flex items-center justify-center">
            <span className="bg-green-500 text-black px-2 py-1 rounded-md mr-2 font-extrabold text-lg">W</span>
            <span className="font-bold text-xl text-white">Wanzami</span>
        </Link>
        <p className="text-gray-400 mt-2">Register to enjoy the features</p>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300" htmlFor="username">
            Username
          </label>
          <input id="username" name="username" type="text" required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="yourusername" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" />
        </div>

        <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="password">
                Password
            </label>
            <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-gray-300" htmlFor="confirm-password">
                Confirm Password
            </label>
            <div className="relative">
                <input id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} required className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
        
        <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500" />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                I agree to our <Link href="/privacy" className="text-green-400 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-green-400 hover:underline">Term & Conditions</Link>
            </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-black bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Continue
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-green-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}