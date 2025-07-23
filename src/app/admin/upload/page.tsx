"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

export default function AdminUploadPage() {
    const [contentType, setContentType] = useState('movie');
    const [posterPreview, setPosterPreview] = useState('https://placehold.co/200x300/2D3748/4A5568?text=Poster');
    const [backdropPreview, setBackdropPreview] = useState('https://placehold.co/320x180/2D3748/4A5568?text=Backdrop');
    const [trailerFilename, setTrailerFilename] = useState('No file chosen');
    const [mainFilename, setMainFilename] = useState('No file chosen');
    
    // State to hold the actual file objects
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [backdropFile, setBackdropFile] = useState<File | null>(null);
    const [trailerFile, setTrailerFile] = useState<File | null>(null);
    const [mainFiles, setMainFiles] = useState<FileList | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'poster' | 'backdrop' | 'trailer' | 'main') => {
        const files = e.target.files;

        // Safely handle the case where no files are selected
        if (!files || files.length === 0) {
            if (type === 'trailer') setTrailerFilename('No file chosen');
            if (type === 'main') setMainFilename('No file chosen');
            return;
        }

        const firstFile = files[0];

        if (type === 'poster') {
            setPosterFile(firstFile);
            setPosterPreview(URL.createObjectURL(firstFile));
        }
        if (type === 'backdrop') {
            setBackdropFile(firstFile);
            setBackdropPreview(URL.createObjectURL(firstFile));
        }
        if (type === 'trailer') {
            setTrailerFile(firstFile);
            setTrailerFilename(firstFile.name);
        }
        if (type === 'main') {
            setMainFiles(files);
            if (e.target.multiple) {
                const numFiles = files.length;
                setMainFilename(`${numFiles} file(s) selected`);
            } else {
                setMainFilename(firstFile.name);
            }
        }
    };
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setUploadStatus('Initiating upload...');

        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const genres = formData.get('genres') as string;
        
        const filesToUpload = [
            { key: 'poster', file: posterFile },
            { key: 'backdrop', file: backdropFile },
            { key: 'trailer', file: trailerFile },
            // Add main files, handling multiple for series
            ...(Array.from(mainFiles || [])).map(file => ({ key: 'main', file }))
        ].filter(f => f.file);


        try {
            // 1. Get pre-signed URLs from our API
            setUploadStatus('Getting upload links...');
            const presignResponse = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    genres,
                    contentType,
                    files: filesToUpload.map(f => ({
                        key: f.key,
                        name: f.file!.name,
                        type: f.file!.type,
                    })),
                }),
            });

            const { contentId, signedUrls } = await presignResponse.json();
            if (!presignResponse.ok) throw new Error('Failed to get pre-signed URLs.');

            // 2. Upload files directly to S3
            setUploadStatus('Uploading files...');
            await Promise.all(
                signedUrls.map((signedUrlInfo: { url: string }, index: number) => {
                    const file = filesToUpload[index].file;
                    return fetch(signedUrlInfo.url, {
                        method: 'PUT',
                        body: file,
                        headers: { 'Content-Type': file!.type },
                    });
                })
            );

            // 3. Finalize the upload by updating the status in DynamoDB
            setUploadStatus('Finalizing...');
            await fetch('/api/admin/finalize-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId }),
            });

            setUploadStatus('Upload complete!');
            alert('Content uploaded successfully!');
            // Optionally reset the form here
            
        } catch (error) {
            console.error(error);
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            setUploadStatus(`Error: ${errorMessage}`);
            alert(`Upload failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0B0C10] text-gray-200 min-h-screen">
            <header className="bg-[#13151a] shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-2">
                            <Image src="/images/logo.png" alt="Wanzami Logo" width={32} height={32}/>
                            <span className="font-bold text-xl">Wanzami Admin</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Upload New Content</h1>
                    <form onSubmit={handleSubmit} className="space-y-8 bg-[#13151a] p-8 rounded-2xl border border-gray-800">
                        {/* Core Details Section */}
                        <div className="border-b border-gray-700 pb-8">
                            <h2 className="text-xl font-semibold mb-4">Core Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                                    <input type="text" name="title" id="title" className="form-input w-full rounded-md p-2 bg-[#1A202C] border-gray-700" placeholder="e.g., The Mandalorian" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Content Type</label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="flex items-center">
                                            <input type="radio" name="contentType" value="movie" className="form-radio bg-gray-700 border-gray-600 text-theme-orange focus:ring-theme-orange" checked={contentType === 'movie'} onChange={() => setContentType('movie')} />
                                            <span className="ml-2 text-sm">Movie</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="contentType" value="series" className="form-radio bg-gray-700 border-gray-600 text-theme-orange focus:ring-theme-orange" checked={contentType === 'series'} onChange={() => setContentType('series')} />
                                            <span className="ml-2 text-sm">Series</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="description" className="block text-sm font-medium mb-1">Description / Synopsis</label>
                                <textarea name="description" id="description" rows={4} className="form-input w-full rounded-md p-2 bg-[#1A202C] border-gray-700" placeholder="A short summary of the movie..." required></textarea>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="genres" className="block text-sm font-medium mb-1">Genres (comma-separated)</label>
                                <input type="text" name="genres" id="genres" className="form-input w-full rounded-md p-2 bg-[#1A202C] border-gray-700" placeholder="Action, Adventure, Drama" required />
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="border-b border-gray-700 pb-8">
                            <h2 className="text-xl font-semibold mb-4">Images</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Poster Image (2:3 Ratio)</label>
                                    <input type="file" name="poster" id="poster" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'poster')} required />
                                    <label htmlFor="poster" className="file-input-label flex flex-col items-center justify-center p-6 rounded-lg text-center bg-[#2D3748] border-dashed border-gray-600 hover:border-theme-orange hover:bg-gray-700 cursor-pointer">
                                        <Image id="poster-preview" src={posterPreview} width={96} height={144} alt="Poster Preview" className="w-24 h-36 object-cover rounded-md mb-2" />
                                        <span className="text-sm text-gray-400">Click to upload</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Backdrop Image (16:9 Ratio)</label>
                                    <input type="file" name="backdrop" id="backdrop" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'backdrop')} required />
                                    <label htmlFor="backdrop" className="file-input-label flex flex-col items-center justify-center p-6 rounded-lg text-center bg-[#2D3748] border-dashed border-gray-600 hover:border-theme-orange hover:bg-gray-700 cursor-pointer">
                                        <Image id="backdrop-preview" src={backdropPreview} width={320} height={180} alt="Backdrop Preview" className="w-full h-36 object-cover rounded-md mb-2" />
                                        <span className="text-sm text-gray-400">Click to upload</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Video Files Section */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Video Files</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Trailer File</label>
                                    <input type="file" name="trailer" id="trailer" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'trailer')} required />
                                    <label htmlFor="trailer" className="file-input-label flex items-center p-4 rounded-lg bg-[#2D3748] border-dashed border-gray-600 hover:border-theme-orange hover:bg-gray-700 cursor-pointer">
                                        <span className="bg-theme-orange text-white text-sm font-semibold px-4 py-2 rounded-md">Choose File</span>
                                        <span id="trailer-filename" className="ml-4 text-gray-400">{trailerFilename}</span>
                                    </label>
                                </div>
                                <div>
                                    <label id="main-file-label" className="block text-sm font-medium mb-1">{contentType === 'series' ? 'Episode Files' : 'Main Movie File'}</label>
                                    <input type="file" name="main-file" id="main-file" className="hidden" accept="video/*" multiple={contentType === 'series'} onChange={(e) => handleFileChange(e, 'main')} required />
                                    <label htmlFor="main-file" className="file-input-label flex items-center p-4 rounded-lg bg-[#2D3748] border-dashed border-gray-600 hover:border-theme-orange hover:bg-gray-700 cursor-pointer">
                                        <span id="main-file-button-text" className="bg-theme-orange text-white text-sm font-semibold px-4 py-2 rounded-md">{contentType === 'series' ? 'Choose Files' : 'Choose File'}</span>
                                        <span id="main-filename" className="ml-4 text-gray-400">{mainFilename}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-6 text-right">
                            <div className="flex items-center justify-end">
                                {isLoading && <p className="text-sm text-gray-400 mr-4">{uploadStatus}</p>}
                                <button type="submit" disabled={isLoading} className="bg-theme-orange text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50">
                                    {isLoading ? 'Uploading...' : 'Upload Content'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
