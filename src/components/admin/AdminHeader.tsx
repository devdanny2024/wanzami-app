"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AdminHeader() {
    const searchParams = useSearchParams();
    const secret = searchParams.get('secret');

    return (
        <header className="bg-[#13151a] shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:p-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-2">
                        <Image src="/images/logo.png" alt="Wanzami Logo" width={32} height={32}/>
                        <span className="font-bold text-xl">Wanzami Admin</span>
                    </div>
                    <Link href={`/admin/upload?secret=${secret || ''}`} className="bg-theme-orange text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition-colors text-sm">
                        Upload New
                    </Link>
                </div>
            </div>
        </header>
    );
}