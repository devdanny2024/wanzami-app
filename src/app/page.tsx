/*
 * FILE: src/app/page.tsx
 *
 * INSTRUCTIONS: This is the code for your new welcome page.
 * Create this file at 'src/app/page.tsx'.
 */
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/welcome-bg.jpg')` }} // Make sure you have this image in public/images
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="bg-orange-500 text-black px-2 py-1 rounded-md mr-2 font-extrabold text-lg">W</span>
            <span className="font-bold text-xl">Wanzami</span>
          </Link>
          <Link href="/login" className="bg-orange-500 text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition-colors">
            Sign In
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-300">
          Watch anywhere. Cancel anytime.
        </p>
        <div className="mt-8">
          <Link href="/register" className="group bg-orange-500 text-black font-bold text-xl md:text-2xl py-4 px-8 rounded-md inline-flex items-center space-x-2 hover:bg-orange-600 transition-transform duration-200 ease-in-out hover:scale-105">
            <span>Sign Up</span>
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
