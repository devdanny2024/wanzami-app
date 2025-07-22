import HeroSection from "@/components/layout/HeroSection";
import MovieCarousel from "@/components/layout/MovieCarousel";

// Mock Data - Now using local image paths
const carouselData = [
    {
        title: "Continue Watching",
        movies: [
            { id: "1", title: "Guardians of the Galaxy", imgSrc: "/images/gotg.jpg" },
            { id: "2", title: "The Last of Us", imgSrc: "/images/tlou.jpg" },
            { id: "4", title: "Godzilla", imgSrc: "/images/godzilla.jpg" },
            { id: "5", title: "Barbie", imgSrc: "/images/barbie.jpg" },
        ]
    },
    {
        title: "Just Release",
        movies: [
            { id: "6", title: "Barbie", imgSrc: "/images/barbie.jpg" },
            { id: "7", title: "Super Mario Bros", imgSrc: "/images/mario.jpg" },
            { id: "8", title: "The Conjuring", imgSrc: "/images/conjuring.jpg" },
            { id: "9", title: "Your Name", imgSrc: "/images/your-name.jpg" },
        ]
    },
    {
        title: "Your Watchlist",
        movies: [
            { id: "10", title: "Spider-Man: Across the Spider-Verse", imgSrc: "/images/spiderman.jpg" },
            { id: "11", title: "Mechanic", imgSrc: "/images/mechanic.jpg" },
            { id: "12", title: "The Dark Knight", imgSrc: "/images/dark-knight.jpg" },
        ]
    }
];

export default function DiscoverPage() {
  return (
    <div>
      <HeroSection />
      {/* Partners Section - as seen in the design */}
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
        {carouselData.map((carousel) => (
            <MovieCarousel key={carousel.title} title={carousel.title} movies={carousel.movies} />
        ))}
      </div>
    </div>
  );
}