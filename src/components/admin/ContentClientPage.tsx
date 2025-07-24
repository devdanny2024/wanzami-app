/*
 * FILE: src/components/admin/ContentClientPage.tsx
 *
 * INSTRUCTIONS: This version has been updated to restore the on-hover
 * functionality for the action buttons on each movie tile.
 */
"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Edit, Archive, Trash2, CheckCircle, Clock, XCircle, MoreVertical, FileText, Clapperboard } from 'lucide-react';
import NProgress from 'nprogress';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';

// Define a type for our movie data
interface Movie {
  id: string;
  title: string;
  imgSrc: string;
  contentType: 'movie' | 'series';
  genres: string[];
  status: 'AVAILABLE' | 'PENDING_UPLOAD' | 'ARCHIVED';
  topCast: { name: string; imgSrc: string }[];
}

export default function ContentClientPage() {
    const s3BaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`;
    const searchParams = useSearchParams();
    const secret = searchParams.get('secret');

    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: 'All',
        type: 'All',
        genre: 'All',
    });
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            NProgress.start();
            setIsLoading(true);
            try {
                const res = await fetch('/api/movies');
                if (!res.ok) throw new Error('Failed to fetch content');
                const data = await res.json();
                setMovies(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
                NProgress.done();
            }
        };
        fetchMovies();
    }, []);

    const filteredMovies = useMemo(() => {
        return movies.filter(movie => {
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = movie.title.toLowerCase().includes(searchLower);
            const castMatch = movie.topCast?.some(cast => cast.name.toLowerCase().includes(searchLower));

            const statusMatch = filters.status === 'All' || movie.status === filters.status;
            const typeMatch = filters.type === 'All' || movie.contentType === filters.type.toLowerCase();
            const genreMatch = filters.genre === 'All' || movie.genres?.includes(filters.genre);

            return (titleMatch || castMatch) && statusMatch && typeMatch && genreMatch;
        });
    }, [movies, searchQuery, filters]);

    const handleFilterChange = (filterType: 'status' | 'type' | 'genre', value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const openDeleteModal = (movie: Movie) => {
        setMovieToDelete(movie);
        setIsDeleteModalOpen(true);
    };
    
    const handleDeleteSuccess = (deletedMovieId: string) => {
        setMovies(prev => prev.filter(movie => movie.id !== deletedMovieId));
        setIsDeleteModalOpen(false);
    };

    const handleArchiveToggle = async (movie: Movie) => {
        const newStatus = movie.status === 'ARCHIVED' ? 'AVAILABLE' : 'ARCHIVED';
        NProgress.start();
        try {
            const res = await fetch('/api/admin/content/archive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movieId: movie.id, status: newStatus, secretKey: secret }),
            });
            if (!res.ok) throw new Error('Failed to update status');
            setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, status: newStatus } : m));
        } catch (error) {
            console.error('Archive failed:', error);
            alert("Failed to update status. Check permissions or server logs.");
        } finally {
            NProgress.done();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Content Management</h1>
            </div>

            <div className="bg-[#13151a] p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 items-center mb-8">
                <div className="relative w-full md:w-1/3">
                    <input 
                        type="text" 
                        className="form-input w-full" 
                        placeholder="Search by title or cast..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                </div>
                <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
                    <select onChange={(e) => handleFilterChange('status', e.target.value)} className="form-select">
                        <option value="All">Status: All</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="PENDING_UPLOAD">Processing</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                    <select onChange={(e) => handleFilterChange('type', e.target.value)} className="form-select">
                        <option value="All">Type: All</option>
                        <option value="movie">Movie</option>
                        <option value="series">Series</option>
                    </select>
                    <select onChange={(e) => handleFilterChange('genre', e.target.value)} className="form-select">
                        <option value="All">Genre: All</option>
                        <option>Action</option><option>Comedy</option><option>Drama</option><option>Sci-Fi</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <p className="text-center text-gray-400">Loading content...</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredMovies.map(movie => {
                        const imageUrl = movie.imgSrc ? `${s3BaseUrl}/${movie.imgSrc}` : 'https://placehold.co/300x450';
                        return (
                        <div key={movie.id} className="group relative rounded-lg overflow-hidden aspect-[2/3] bg-gray-800">
                            <Image src={imageUrl} alt={movie.title} width={300} height={450} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2">
                                <h3 className="text-white font-bold text-center mb-3 text-sm">{movie.title}</h3>
                                {movie.status === 'PENDING_UPLOAD' ? (
                                    <div className="text-center text-xs font-semibold text-yellow-400 py-2 bg-yellow-500/10 rounded-md w-full">Processing...</div>
                                ) : (
                                    <div className="space-y-2 w-full">
                                        <Link href={`/admin/content/edit/${movie.id}?secret=${secret}`} className="w-full bg-gray-200 text-black text-xs font-bold py-2 rounded-md hover:bg-white flex items-center justify-center gap-2"><Edit size={14}/> Edit</Link>
                                        <button onClick={() => handleArchiveToggle(movie)} className={`w-full text-xs font-bold py-2 rounded-md flex items-center justify-center gap-2 ${movie.status === 'ARCHIVED' ? 'bg-green-500 text-black hover:bg-green-600' : 'bg-yellow-500 text-black hover:bg-yellow-600'}`}>
                                            {movie.status === 'ARCHIVED' ? <CheckCircle size={14}/> : <Archive size={14}/>}
                                            {movie.status === 'ARCHIVED' ? 'Restore' : 'Archive'}
                                        </button>
                                        <button onClick={() => openDeleteModal(movie)} className="w-full bg-red-600 text-white text-xs font-bold py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"><Trash2 size={14}/> Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )})}
                </div>
            )}
            
            {isDeleteModalOpen && movieToDelete && (
                <DeleteConfirmationModal
                    movie={movieToDelete}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteSuccess}
                />
            )}
        </div>
    );
}
