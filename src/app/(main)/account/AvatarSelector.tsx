"use client";

import Image from 'next/image';

interface AvatarSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (src: string) => void;
}

const avatars = Array.from({ length: 10 }, (_, i) => `/images/avatars/${i + 1}.png`);

export default function AvatarSelector({ isOpen, onClose, onSelect }: AvatarSelectorProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#13151a] border border-gray-800 rounded-2xl shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Choose Your Avatar</h2>
                <div className="grid grid-cols-5 gap-4">
                    {avatars.map((src) => (
                        <button
                            key={src}
                            onClick={() => onSelect(src)}
                            className="aspect-square rounded-full overflow-hidden ring-4 ring-transparent hover:ring-theme-orange/50 transition-all duration-200 focus:outline-none"
                        >
                            <Image src={src} alt={`Avatar ${src}`} width={100} height={100} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
