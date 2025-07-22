"use client";

import { Edit } from 'lucide-react';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AvatarSelector from './AvatarSelector'; // New component

type UserProfile = {
    username?: string;
    email?: string;
    preferred_username?: string;
    picture?: string;
};

export default function ProfileSettings({ user }: { user: UserProfile }) {
    const router = useRouter();
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState(user.picture || `/images/avatars/1.png`);
    const [username, setUsername] = useState(user.preferred_username || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username,
                    picture: currentAvatar 
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.details || 'Failed to update profile.');
            
            // Refresh the page to show updated info in the header
            router.refresh();

        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <div className="flex items-center space-x-6 pb-8 border-b border-gray-700">
                    <div className="relative">
                        <Image className="w-24 h-24 rounded-full object-cover" src={currentAvatar} alt="User Avatar" width={100} height={100} />
                        <button onClick={() => setIsAvatarModalOpen(true)} className="absolute bottom-0 right-0 bg-theme-orange p-2 rounded-full hover:bg-orange-600">
                            <Edit className="w-4 h-4 text-white" />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">{user.preferred_username || user.username}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme-orange" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input type="email" id="email" value={user.email || ''} disabled className="mt-1 block w-full px-3 py-2 bg-[#0B0C10] border border-gray-700 rounded-md text-gray-400 cursor-not-allowed" />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <div className="pt-4">
                        <button type="submit" disabled={isLoading} className="bg-theme-orange text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
            <AvatarSelector
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onSelect={(avatarSrc) => {
                    setCurrentAvatar(avatarSrc);
                    setIsAvatarModalOpen(false);
                }}
            />
        </>
    );
}
