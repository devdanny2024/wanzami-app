"use client";

import { useState } from 'react';
import { User, Ticket, FileText, Settings } from 'lucide-react';
import ProfileSettings from './ProfileSettings'; // We'll create this next

// Define a type for the user object for better type safety
type UserProfile = {
    username?: string;
    email?: string;
    preferred_username?: string;
};

const PaidMovies = () => <div className="text-gray-400">Your purchased movies will appear here.</div>;
const BillingHistory = () => <div className="text-gray-400">Your billing history will appear here.</div>;
const GeneralSettings = () => <div className="text-gray-400">General settings will be available here.</div>;

export default function AccountPageClient({ user }: { user: UserProfile }) {
    const [activeTab, setActiveTab] = useState('profile');

    const navItems = [
        { id: 'profile', label: 'Profile', icon: User, component: <ProfileSettings user={user} /> },
        { id: 'paid-movies', label: 'Paid Movies', icon: Ticket, component: <PaidMovies /> },
        { id: 'billing', label: 'Billing History', icon: FileText, component: <BillingHistory /> },
        { id: 'settings', label: 'Settings', icon: Settings, component: <GeneralSettings /> },
    ];

    const activeComponent = navItems.find(item => item.id === activeTab)?.component;

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">My Account</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4">
                    <nav className="space-y-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeTab === item.id 
                                    ? 'bg-gray-800/50 text-white font-semibold' 
                                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>
                <div className="lg:w-3/4 bg-[#13151a] p-8 rounded-2xl border border-gray-800">
                    {activeComponent}
                </div>
            </div>
        </main>
    );
}