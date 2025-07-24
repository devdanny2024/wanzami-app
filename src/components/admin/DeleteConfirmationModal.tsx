"use client";

import { useState, FormEvent } from 'react';
import NProgress from 'nprogress';

interface Movie {
  id: string;
  title: string;
}

interface DeleteConfirmationModalProps {
    movie: Movie;
    onClose: () => void;
    onConfirm: (deletedMovieId: string) => void;
}

export default function DeleteConfirmationModal({ movie, onClose, onConfirm }: DeleteConfirmationModalProps) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        NProgress.start();

        try {
            const res = await fetch('/api/admin/content/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movieId: movie.id, adminPassword: password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.details || 'Deletion failed.');
            
            onConfirm(movie.id);

        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
            NProgress.done();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A202C] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
                <p className="text-gray-400 mt-2">
                    Are you sure you want to permanently delete <span className="font-bold text-theme-orange">{movie.title}</span>? This action cannot be undone.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="admin-password" className="text-sm font-medium text-gray-300">Admin Password</label>
                        <input
                            type="password"
                            id="admin-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input w-full rounded-md p-2 mt-1 bg-[#0B0C10] border-gray-600"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-white px-4 py-2 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 disabled:opacity-50">
                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
