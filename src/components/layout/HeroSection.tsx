import { Play, Plus } from 'lucide-react';

export const HeroSection = () => {
    return (
        <section className="relative text-white pt-48 pb-20 -mt-20 h-[80vh] flex items-center overflow-hidden">
            {/* Background Container */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                {/* Static Image Fallback for all screens, shown by default */}
                <img 
                    src="/images/mandalorian-hero.jpg" 
                    alt="Hero background"
                    className="w-full h-full object-cover md:hidden" // Hidden on medium screens and up
                />
                {/* Video Background for larger screens */}
                <video 
                    autoPlay 
                    loop 
                    muted
                    playsInline
                    className="w-full h-full object-cover hidden md:block" // Hidden on small screens
                    src="/videos/1.mp4" 
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/70 to-transparent" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div className="max-w-xl">
                    <p className="font-semibold text-theme-orange">Series</p>
                    <h1 className="text-5xl md:text-7xl font-extrabold my-4 tracking-tight">The Mandalorian</h1>
                    <div className="flex items-center space-x-4 text-gray-300 mb-6 text-sm md:text-base">
                        <span>9 Episodes</span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        <span>2022</span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        <span>Fantasy - Actions</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="button-primary flex items-center space-x-2">
                            <Play size={20} className="fill-current" />
                            <span>Continue Watching</span>
                        </button>
                        <button className="button-secondary flex items-center space-x-2">
                            <Plus size={20} />
                            <span>Add Watchlist</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};