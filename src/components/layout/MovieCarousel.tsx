import VideoCard from '@/components/video/VideoCard';

interface Movie {
    id: string;
    title: string;
    imgSrc: string;
}

interface MovieCarouselProps {
    title: string;
    movies: Movie[];
}

const MovieCarousel = ({ title, movies }: MovieCarouselProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
                {movies.map((movie) => (
                    <VideoCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MovieCarousel;
