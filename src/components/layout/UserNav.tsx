"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from './LogoutButton';

type UserProfile = {
    picture?: string;
};

const UserNav = ({ user }: { user: UserProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Use the user's picture if available, otherwise default to a placeholder
    const avatarSrc = user.picture || '/images/avatars/1.png';

    return (
        <div className="relative hidden lg:block">
            <button onClick={() => setIsOpen(!isOpen)} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white cursor-pointer ring-2 ring-transparent hover:ring-theme-orange transition-all overflow-hidden">
                <Image src={avatarSrc} alt="User Avatar" width={36} height={36} className="object-cover" />
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

export default UserNav;

// Other files (MobileNav, LogoutButton, etc.) remain unchanged.
