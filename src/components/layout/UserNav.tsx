"use client";

import { useState } from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const UserNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative hidden lg:block">
            <button onClick={() => setIsOpen(!isOpen)} className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer ring-2 ring-transparent hover:ring-theme-orange transition-all">
                U
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#13151a] border border-gray-700 rounded-md shadow-lg py-1 z-20">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50">My Account</Link>
                    <Link href="/watchlist" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50">Watchlist</Link>
                    <div className="border-t border-gray-700 my-1" />
                    <LogoutButton />
                </div>
            )}
        </div>
    );
};