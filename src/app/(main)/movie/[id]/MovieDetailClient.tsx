"use client";

import Image from "next/image";
import { Play, Plus, Download, Share2, ThumbsUp } from "lucide-react";
import MovieCarousel from "@/components/layout/MovieCarousel";

// Define explicit types for our props for better type safety.
// This makes the component independent of the server-side data source.
interface CastMember {
    name: string;
    imgSrc: string;
}

interface Episode {
    num: number;
    title: string;
    duration: string;
    thumb: string;
}

interface Movie {
    id: string;
    title: string;
    type: string;
    year: number;
    genres: string[];
    storyLine: string;
    topCast: CastMember[];
    heroImage: string;
    episodeList?: Episode[];
}

interface SimilarMovies {
    title: string;
    movies: { id: string; title: string; imgSrc: string; }[];
}

interface MovieDetailClientProps {
    movie: Movie;
    similarMovies: SimilarMovies;
}

export default function MovieDetailClient({ movie, similarMovies }: MovieDetailClientProps) {
  return (
    <div>
      {/* Hero Section for the Movie */}
      <section className="relative -mt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/70 to-transparent z-10" />
        <Image
          src={movie.heroImage}
          alt={movie.title}
          width={1920}
          height={1080}
          className="w-full h-[60vh] md:h-[80vh] object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <p className="text-green-400 font-semibold">{movie.type}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold my-3 tracking-tight text-white">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-gray-300 mb-6 text-sm">
                <span>{movie.year}</span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>{movie.genres.join(' - ')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 flex items-center space-x-2">
                    <Play size={20} className="fill-current" />
                    <span>{movie.type === 'Series' ? 'Continue Watching' : 'Play Now'}</span>
                </button>
                <button className="bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 flex items-center space-x-2">
                    <Plus size={20} />
                    <span>Add Watchlist</span>
                </button>
                <div className="flex items-center space-x-4 ml-auto">
                    <button className="text-gray-300 hover:text-white flex items-center space-x-2"><Download size={20} /> <span className="hidden md:inline">Download</span></button>
                    <button className="text-gray-300 hover:text-white flex items-center space-x-2"><Share2 size={20} /> <span className="hidden md:inline">Share</span></button>
                    <button className="bg-red-500/80 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 flex items-center space-x-2"><ThumbsUp size={20} /> <span className="hidden md:inline">Liked</span></button>
                </div>
            </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Story Line and Top Cast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-4">Story Line</h2>
                <p className="text-gray-300 leading-relaxed">{movie.storyLine}</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Top Cast</h2>
                <div className="space-y-4">
                    {movie.topCast.map(actor => (
                        <div key={actor.name} className="flex items-center space-x-3">
                            <Image src={actor.imgSrc} alt={actor.name} width={40} height={40} className="rounded-full object-cover" />
                            <span className="text-gray-300">{actor.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Episode List (only for series) */}
        {movie.type === 'Series' && movie.episodeList && (
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">1-9 Episode</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movie.episodeList.map(ep => (
                        <div key={ep.num} className="group cursor-pointer">
                            <div className="relative rounded-lg overflow-hidden aspect-video mb-2">
                                <Image src={ep.thumb} alt={`Episode ${ep.num}`} width={400} height={225} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play size={32} className="text-white fill-current" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-white">Chapter {ep.num}</h3>
                            <p className="text-sm text-gray-400">{ep.duration}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Similar Movies Carousel */}
        <MovieCarousel title={similarMovies.title} movies={similarMovies.movies} />
      </div>
    </div>
  );
}