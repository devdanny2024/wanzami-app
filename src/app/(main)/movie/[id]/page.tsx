import { notFound } from "next/navigation";
import MovieDetailClient from "./MovieDetailClient";

// --- MOCK DATA ---
const allMoviesData = {
  "1": {
    id: "1",
    title: "Guardians of the Galaxy Vol. 3",
    type: "Movie",
    year: 2023,
    duration: "2h 40m",
    genres: ["Fantasy", "Actions"],
    storyLine: "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own - a mission that could mean the end of the Guardians if not successful.",
    topCast: [
      { name: "Chris Pratt", imgSrc: "/images/cast/chris-pratt.jpg" },
      { name: "Zoe Saldaña", imgSrc: "/images/cast/zoe-saldana.jpg" },
      { name: "Dave Bautista", imgSrc: "/images/cast/dave-bautista.jpg" },
      { name: "Karen Gillan", imgSrc: "/images/cast/karen-gillan.jpg" },
    ],
    heroImage: "/images/gotg-hero.jpg",
  },
  "2": {
    id: "2",
    title: "The Last of Us: Season 1",
    type: "Series",
    year: 2023,
    episodes: 9,
    genres: ["Action", "Adventure", "Drama"],
    storyLine: "In a post-apocalyptic world, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    topCast: [
        { name: "Pedro Pascal", imgSrc: "/images/cast/pedro-pascal.jpg" },
        { name: "Bella Ramsey", imgSrc: "/images/cast/bella-ramsey.jpg" },
        { name: "Anna Torv", imgSrc: "/images/cast/anna-torv.jpg" },
    ],
    heroImage: "/images/tlou-hero.jpg",
    episodeList: [
        { num: 1, title: "When You're Lost in the Darkness", duration: "00:57:45", thumb: "/images/episodes/tlou-ep1.jpg"},
        { num: 2, title: "Infected", duration: "00:57:45", thumb: "/images/episodes/tlou-ep2.jpg"},
        { num: 3, title: "Long, Long Time", duration: "00:57:45", thumb: "/images/episodes/tlou-ep3.jpg"},
        { num: 4, title: "Please Hold to My Hand", duration: "00:57:45", thumb: "/images/episodes/tlou-ep4.jpg"},
    ]
  },
};

const similarMovies = {
    title: "Similar Movies for you",
    movies: [
        { id: "10", title: "Top Gun: Maverick", imgSrc: "/images/top-gun.jpg" },
        { id: "11", title: "Spider-Man: Into the Spider-Verse", imgSrc: "/images/spiderman-into.jpg" },
        { id: "12", title: "Black Panther: Wakanda Forever", imgSrc: "/images/wakanda-forever.jpg" },
        { id: "13", title: "Batman v Superman", imgSrc: "/images/bvs.jpg" },
    ]
};
// --- END MOCK DATA ---

// Defining the props type. Note that `params` itself is the promise.
type PageProps = {
  params: Promise<{ id: string }>;
};

// This is a Server Component, so we use async/await
export default async function MovieDetailPage({ params }: PageProps) {
  // As per the Next.js 15 docs, we must await the params object
  const { id } = await params;
  const movie = allMoviesData[id as keyof typeof allMoviesData];

  if (!movie) {
    notFound();
  }

  return <MovieDetailClient movie={movie} similarMovies={similarMovies} />;
}
