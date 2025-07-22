"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
  isLoggedIn: boolean;
}

const MobileNav = ({ navLinks, isLoggedIn }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button onClick={() => setIsOpen(true)} className="text-gray-300 hover:text-white">
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed top-0 right-0 bottom-0 w-64 bg-[#13151a] p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
            <nav className="mt-12 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white text-lg" onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-700 my-4" />
              {isLoggedIn ? (
                <LogoutButton />
              ) : (
                 <Link href="/login" className="bg-theme-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors text-center" onClick={() => setIsOpen(false)}>
                    Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
