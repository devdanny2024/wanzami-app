import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface Movie {
    id: string;
    title: string;
    imgSrc: string;
}

const VideoCard = ({ movie }: { movie: Movie }) => {
    return (
        <Link href={`/movie/${movie.id}`} className="group flex-shrink-0 w-40 md:w-48 lg:w-56">
            <div className="relative rounded-lg overflow-hidden aspect-[2/3] transition-transform duration-300 ease-in-out group-hover:scale-105">
                <Image
                    src={movie.imgSrc}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Play size={24} className="text-white fill-current" />
                    </div>
                </div>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-200 truncate">{movie.title}</h3>
        </Link>
    );
};

export default VideoCard;