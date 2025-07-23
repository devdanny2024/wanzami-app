"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// IMPORTANT: Replace these placeholders with your actual image paths
const backgroundImages = [
    '/images/auth-bg-3.jpg',
    '/images/auth-bg-2.jpg',
    '/images/auth-bg-1.jpg',
    '/images/auth-bg-4.jpg',
    '/images/auth-bg-5.jpg',
];

export default function WelcomePage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background Image Slideshow */}
      {backgroundImages.map((src, index) => (
          <div
              key={src}
              className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{ 
                  backgroundImage: `url(${src})`,
                  opacity: index === currentBgIndex ? 1 : 0,
              }}
          />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
            <Image src="/images/logo.png" alt="Wanzami Logo" width={32} height={32} />
            <span className="font-bold text-xl">Wanzami</span>
          </Link>
          <Link href="/login" className="bg-theme-orange text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition-colors">
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
          <Link href="/register" className="group bg-theme-orange text-white font-bold text-xl md:text-2xl py-4 px-8 rounded-md inline-flex items-center space-x-2 hover:bg-orange-600 transition-transform duration-200 ease-in-out hover:scale-105">
            <span>Sign Up</span>
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
