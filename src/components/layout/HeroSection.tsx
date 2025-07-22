import { Play, Plus } from 'lucide-react';

const HeroSection = () => {
    return (
        <section 
            className="relative text-white pt-48 pb-20 -mt-20 h-[80vh] flex items-center overflow-hidden"
        >
            {/* Video Background (Desktop Only) */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1] hidden md:block">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                    src="/videos/1.mp4" // Your local video path
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/70 to-transparent" />
            </div>

            {/* Image Background (Mobile Only) */}
            <div 
                className="absolute top-0 left-0 w-full h-full z-[-1] block md:hidden bg-cover bg-center"
                style={{ backgroundImage: `url('/images/mandalorian-hero.png')` }}
            >
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
                        <button className="bg-theme-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 flex items-center space-x-2">
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