"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Clapperboard, Users, BarChart4 } from "lucide-react";

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Content', icon: Clapperboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart4 },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const secret = searchParams.get('secret');

    return (
        <aside className="w-64 bg-[#13151a] p-4 hidden md:block border-r border-gray-800 h-[calc(100vh-80px)] sticky top-20">
            <nav className="space-y-2">
                {navItems.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={`${item.href}?secret=${secret || ''}`}
                            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                                isActive ? 'bg-theme-orange/20 text-theme-orange font-semibold' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
}