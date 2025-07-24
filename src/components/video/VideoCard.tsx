import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

// Define the Movie interface within this file's scope
interface VideoCardMovie {
  id: string;
  title: string;
  imgSrc: string;
}

export function VideoCard({ movie }: { movie: VideoCardMovie }) {
    // Construct the full S3 URL for the image
    const s3BaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`;
    const imageUrl = movie.imgSrc ? `${s3BaseUrl}/${movie.imgSrc}` : 'https://placehold.co/300x450';

    return (
        <Link href={`/movie/${movie.id}`} className="group flex-shrink-0 w-40 md:w-48 lg:w-56">
            <div className="relative rounded-lg overflow-hidden aspect-[2/3] transition-transform duration-300 ease-in-out group-hover:scale-105">
                <Image
                    src={imageUrl}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button className="bg-theme-orange/80 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play size={20} className="fill-current" />
                    </button>
                </div>
            </div>
            <h3 className="mt-2 font-semibold text-sm truncate">{movie.title}</h3>
        </Link>
    );
}
