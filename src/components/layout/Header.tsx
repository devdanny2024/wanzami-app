"use client"; // This component uses client-side interactivity (e.g., for mobile menu)

import Link from "next/link";
import { useState } from "react";
import { Search, Bell, Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/discover", label: "Discover" },
    { href: "/releases", label: "Movie Release" },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Main Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold flex items-center">
                {/* Replace with actual logo later */}
                <span className="bg-green-500 text-black px-2 py-1 rounded-md mr-2 font-extrabold text-lg">W</span>
                <span className="hidden sm:inline font-bold text-xl">Wanzami</span>
              </Link>
              <nav className="hidden lg:flex items-center space-x-6 text-gray-300">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-white transition-colors duration-200 text-sm font-medium">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Search, User and Hamburger */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white">
                <Search size={20} />
              </button>
              <button className="text-gray-300 hover:text-white">
                <Bell size={20} />
              </button>
              <div className="hidden lg:block">
                {/* Placeholder for user avatar */}
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
                  U
                </div>
              </div>
              <button
                className="lg:hidden text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0C10] fixed top-20 left-0 right-0 bottom-0 z-40 p-4">
           <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200 text-lg p-2 rounded-md text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
            </nav>
        </div>
      )}
    </>
  );
};

export default Header;
