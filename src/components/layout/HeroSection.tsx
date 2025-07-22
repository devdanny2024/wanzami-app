import { Play, Plus } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <section 
            className="relative text-white pt-48 pb-20 -mt-20" // -mt-20 pulls it under the transparent header
            style={{
                backgroundImage: `linear-gradient(to top, rgba(11, 12, 16, 1) 10%, rgba(11, 12, 16, 0.5) 50%, rgba(11, 12, 16, 0.1) 100%), url('https://placehold.co/1920x1080/000000/FFFFFF?text=The+Mandalorian')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
            }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl">
                    <p className="text-green-400 font-semibold">Series</p>
                    <h1 className="text-5xl md:text-7xl font-extrabold my-4 tracking-tight">The Mandalorian</h1>
                    <div className="flex items-center space-x-4 text-gray-300 mb-6 text-sm md:text-base">
                        <span>9 Episodes</span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        <span>2022</span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        <span>Fantasy - Actions</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 flex items-center space-x-2">
                            <Play size={20} className="fill-current" />
                            <span>Continue Watching</span>
                        </button>
                        <button className="bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 flex items-center space-x-2">
                            <Plus size={20} />
                            <span>Add Watchlist</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
