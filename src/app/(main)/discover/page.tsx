import HeroSection from "@/components/layout/HeroSection";
import MovieCarousel from "@/components/layout/MovieCarousel";
import Image from "next/image";

// Define a type for our movie data
interface Movie {
  id: string;
  title: string;
  imgSrc: string;
  // Add other fields from your database here as needed
}

// This function will fetch movies from our API endpoint.
// It's called on the server when the page is rendered.
async function getMovies(): Promise<Movie[]> {
  try {
    // We need the full URL for server-side fetching
    const apiUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/movies`
      : "http://localhost:3000/api/movies";
      
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Don't cache data during development
    });

    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    return []; // Return an empty array on error
  }
}

export default async function DiscoverPage() {
  const movies = await getMovies();

  // We can create different carousels by filtering or categorizing movies
  // For now, we'll just show one "All Movies" carousel.
  const allMoviesCarousel = {
    title: "All Movies",
    movies: movies,
  };

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
        {/* Render the carousel only if there are movies */}
        {movies.length > 0 ? (
          <MovieCarousel title={allMoviesCarousel.title} movies={allMoviesCarousel.movies} />
        ) : (
          <p className="text-center text-gray-400">No movies found. Please add some to the database.</p>
        )}
      </div>
    </div>
  );
}