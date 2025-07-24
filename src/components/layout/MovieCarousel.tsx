import { VideoCard } from '@/components/video/VideoCard';

interface CarouselMovie { // Renamed to avoid conflicts within this file
  id: string;
  title: string;
  imgSrc: string;
}

interface MovieCarouselProps {
  title: string;
  movies: CarouselMovie[];
}

export default function MovieCarousel({ title, movies }: MovieCarouselProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {movies.map((movie) => (
          <VideoCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
