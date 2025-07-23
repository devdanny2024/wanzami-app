"use client";

import { useState, useEffect } from 'react';

// IMPORTANT: Replace these placeholders with your actual image paths
const backgroundImages = [
    '/images/auth-bg-3.jpg',
    '/images/auth-bg-2.jpg',
    '/images/auth-bg-1.jpg',
    '/images/auth-bg-4.jpg',
    '/images/auth-bg-5.jpg',
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

        {/* Form Content */}
        <div className="relative z-20 w-full">
            {children}
        </div>
    </div>
  );
}