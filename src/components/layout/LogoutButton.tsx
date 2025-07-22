"use client";

import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50"
        >
            Logout
        </button>
    );
};

export default LogoutButton;