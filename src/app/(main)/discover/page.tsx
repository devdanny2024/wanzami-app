import { HeroSection } from "@/components/layout/HeroSection";
import MovieCarousel from "@/components/layout/MovieCarousel";
import Image from "next/image";

// Define a type for our movie data
interface Movie {
  id: string;
  title: string;
  imgSrc: string;
  // Add other properties as they exist in your database
}

// Function to fetch movie data from our API
async function getMovies(): Promise<Movie[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/movies`, {
      cache: 'no-store', // Fetch fresh data on every request
    });

    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    return res.json();
  } catch (error) {
    console.error("Fetch movies error:", error);
    return []; // Return an empty array on error
  }
}

export default async function DiscoverPage() {
  const movies = await getMovies();

  // Simple grouping for demonstration purposes
  const carousels = [
    { title: "Continue Watching", movies: movies.slice(0, 5) },
    { title: "Popular of the week", movies: movies.slice(5, 10) },
    { title: "New Releases", movies: movies.slice(10, 15) }
  ];

  return (
    <div>
      <HeroSection />
        <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-4 md:gap-x-12 grayscale opacity-90">
                    {/* Disney+ */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1200px-Disney%2B_logo.svg.png" alt="Disney+" className="h-6 md:h-8" />
                    {/* Netflix */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png" alt="Netflix" className="h-6 md:h-8" />
                    {/* HBO Max */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg" alt="HBO Max" className="h-5 md:h-7" />
                    {/* Marvel */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1200px-Marvel_Logo.svg.png" alt="Marvel" className="h-6 md:h-8" />
                    {/* Star Wars */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg" alt="Star Wars" className="h-8 md:h-10" />
                </div>
            </div>
        </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-12">
        {movies.length > 0 ? (
          carousels.map((carousel, index) => (
            carousel.movies.length > 0 && <MovieCarousel key={index} title={carousel.title} movies={carousel.movies} />
          ))
        ) : (
          <p className="text-center text-gray-400">No movies found. Please add content via the admin panel.</p>
        )}
      </div>
    </div>
  );
}