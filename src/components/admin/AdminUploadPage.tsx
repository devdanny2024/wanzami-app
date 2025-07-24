/*
 * FILE: src/components/admin/AdminUploadPage.tsx
 *
 * INSTRUCTIONS: This version uses your selected design and integrates it
 * with the persistent, global upload queue.
 */
"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, ImagePlus, Loader2, Video, FileText } from 'lucide-react';
import { useUploadContext } from '@/contexts/UploadContext';

// --- TYPE DEFINITIONS ---
export interface UploadFile {
    id: string;
    file: File;
    preview?: string;
    progress: number;
    status: 'queued' | 'uploading' | 'complete' | 'error';
    signedUrl: string;
    contentId: string;
    key: string;
}

interface CastMember {
    id: string;
    name: string;
    picture?: { file: File; preview: string; };
    pictureUrl?: string;
}

interface AdminUploadPageProps {
  initialData?: any;
  secretKey: string;
}

export default function AdminUploadPage({ initialData, secretKey }: AdminUploadPageProps) {
    const isEditMode = !!initialData;
    const s3BaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`;
    const { addToQueue } = useUploadContext(); // Use the global context

    // --- STATE MANAGEMENT ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genres, setGenres] = useState('');
    const [contentType, setContentType] = useState<'movie' | 'series'>('movie');
    const [castMembers, setCastMembers] = useState<CastMember[]>([{ id: crypto.randomUUID(), name: '' }]);
    
    const [poster, setPoster] = useState<{ file: File; preview: string } | null>(null);
    const [backdrop, setBackdrop] = useState<{ file: File; preview: string } | null>(null);
    const [trailer, setTrailer] = useState<File | null>(null);
    const [mainFiles, setMainFiles] = useState<File[]>([]);
    
    const [existingPosterUrl, setExistingPosterUrl] = useState<string | undefined>();
    const [existingBackdropUrl, setExistingBackdropUrl] = useState<string | undefined>();
    const [existingTrailerUrl, setExistingTrailerUrl] = useState<string | undefined>();
    const [existingMainFileUrl, setExistingMainFileUrl] = useState<string | undefined>();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- EFFECTS ---
    useEffect(() => {
        if (isEditMode && initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setGenres(initialData.genres?.join(', ') || '');
            setContentType(initialData.contentType || 'movie');
            
            const castData = initialData.topCast?.map((c: any) => ({ 
                id: crypto.randomUUID(), 
                name: c.name, 
                pictureUrl: c.imgSrc ? `${s3BaseUrl}/${c.imgSrc}` : undefined
            }));
            setCastMembers(castData?.length > 0 ? castData : [{ id: crypto.randomUUID(), name: '' }]);

            if (initialData.imgSrc) setExistingPosterUrl(`${s3BaseUrl}/${initialData.imgSrc}`);
            if (initialData.backdropSrc) setExistingBackdropUrl(`${s3BaseUrl}/${initialData.backdropSrc}`);
            if (initialData.trailerSrc) setExistingTrailerUrl(initialData.trailerSrc);
            if (initialData.mainSrc) setExistingMainFileUrl(initialData.mainSrc);
        }
    }, [isEditMode, initialData, s3BaseUrl]);

    // --- EVENT HANDLERS ---
    const handleFileChange = (setter: React.Dispatch<React.SetStateAction<{ file: File; preview: string } | null>>, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setter({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) });
        }
    };

    const handleSingleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };
    
    const handleMultipleFilesChange = (setter: React.Dispatch<React.SetStateAction<File[]>>, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setter(Array.from(e.target.files));
        }
    };

    const handleCastChange = (id: string, field: 'name' | 'picture', value: string | File) => {
        setCastMembers(castMembers.map(member => {
            if (member.id === id) {
                if (field === 'name' && typeof value === 'string') return { ...member, name: value };
                if (field === 'picture' && value instanceof File) return { ...member, picture: { file: value, preview: URL.createObjectURL(value) }, pictureUrl: undefined };
            }
            return member;
        }));
    };

    const addCastMember = () => setCastMembers([...castMembers, { id: crypto.randomUUID(), name: '' }]);
    const removeCastMember = (id: string) => setCastMembers(castMembers.filter(member => member.id !== id));

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const contentId = isEditMode ? initialData.id : crypto.randomUUID();

        const allFiles: { name: string; type: string; category: string }[] = [];
        if (poster) allFiles.push({ name: poster.file.name, type: poster.file.type, category: 'poster' });
        if (backdrop) allFiles.push({ name: backdrop.file.name, type: backdrop.file.type, category: 'backdrop' });
        if (trailer) allFiles.push({ name: trailer.name, type: trailer.type, category: 'trailer' });
        mainFiles.forEach((file, index) => allFiles.push({ name: file.name, type: file.type, category: `main-${index}` }));
        castMembers.forEach((cast, index) => {
            if (cast.picture) allFiles.push({ name: cast.picture.file.name, type: cast.picture.file.type, category: `cast-${index}` });
        });

        try {
            const res = await fetch(`/api/admin/upload`, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: contentId,
                    title, description, genres: genres.split(',').map(g => g.trim()), contentType,
                    topCast: castMembers.map(c => ({ name: c.name, hasPicture: !!c.picture || !!c.pictureUrl })),
                    files: allFiles,
                    secretKey
                }),
            });

            if (!res.ok) throw new Error('Failed to get pre-signed URLs.');
            
            const { signedUrls } = await res.json();

            const newQueueItems: UploadFile[] = [];
            
            const fileMap: { [key: string]: any } = {
                poster, backdrop, trailer, mainFiles,
                cast: castMembers.map(c => c.picture).filter(Boolean)
            };

            Object.entries(signedUrls).forEach(([key, url]) => {
                if (!url) return;
                const [category, indexStr] = key.split('-');
                const index = indexStr ? parseInt(indexStr, 10) : 0;
                let fileToUpload: { file: File; preview?: string } | File | null | undefined = null;

                if (category === 'cast') {
                    fileToUpload = fileMap.cast[index];
                } else if (category === 'main') {
                    fileToUpload = fileMap.mainFiles[index];
                } else {
                    fileToUpload = fileMap[category];
                }

                if (fileToUpload) {
                     const file = 'file' in fileToUpload ? fileToUpload.file : fileToUpload;
                     const preview = 'preview' in fileToUpload ? fileToUpload.preview : undefined;
                     newQueueItems.push({
                         id: crypto.randomUUID(), file, key, signedUrl: url as string, contentId, progress: 0, status: 'queued', preview
                     });
                }
            });
            
            addToQueue(newQueueItems);

            if (newQueueItems.length === 0 && isEditMode) {
                alert("Content details updated successfully!");
            } else if (newQueueItems.length > 0) {
                 alert(isEditMode ? "Content update process started!" : "Content added to upload queue!");
            }

            if (!isEditMode) {
                setTitle(''); setDescription(''); setGenres(''); setContentType('movie');
                setCastMembers([{ id: crypto.randomUUID(), name: '' }]);
                setPoster(null); setBackdrop(null); setTrailer(null); setMainFiles([]);
            }

        } catch (error) {
            console.error("Submission failed:", error);
            alert("Submission failed: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#13151a] p-6 rounded-xl border border-gray-800 relative">
            <h2 className="text-2xl font-bold mb-6 text-white">{isEditMode ? 'Edit Content' : 'Upload New Content'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Core Details Section */}
                        <div>
                             <h3 className="text-lg font-semibold mb-3 text-white">Core Details</h3>
                             <div className="space-y-4">
                                <input type="text" className="form-input w-full p-2 bg-[#1A202C] border-gray-700 rounded-lg" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required/>
                                <textarea className="form-textarea w-full p-2 h-32 resize-none bg-[#1A202C] border-gray-700 rounded-lg" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description / Synopsis..."></textarea>
                                <input type="text" className="form-input w-full p-2 bg-[#1A202C] border-gray-700 rounded-lg" placeholder="Genres (comma-separated)" value={genres} onChange={e => setGenres(e.target.value)} />
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Content Type</label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="contentType" className="form-radio bg-gray-700 border-gray-600 text-theme-orange focus:ring-theme-orange" checked={contentType === 'movie'} onChange={() => setContentType('movie')} /> Movie</label>
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="contentType" className="form-radio bg-gray-700 border-gray-600 text-theme-orange focus:ring-theme-orange" checked={contentType === 'series'} onChange={() => setContentType('series')} /> Series</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Cast Members Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-white">Cast Members</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {castMembers.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <label htmlFor={`cast-pic-${member.id}`} className="cursor-pointer w-12 h-12 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
                                           {member.picture?.preview ? <Image src={member.picture.preview} alt="New" width={48} height={48} className="w-full h-full object-cover"/> :
                                           member.pictureUrl ? <Image src={member.pictureUrl} alt="Current" width={48} height={48} className="w-full h-full object-cover"/> :
                                           <Plus size={20}/>}
                                        </label>
                                        <input type="file" id={`cast-pic-${member.id}`} className="hidden" accept="image/*" onChange={(e) => { if(e.target.files) handleCastChange(member.id, 'picture', e.target.files[0])}}/>
                                        <input type="text" className="form-input flex-grow p-2 bg-[#1A202C] border-gray-700 rounded-lg" value={member.name} onChange={e => handleCastChange(member.id, 'name', e.target.value)} placeholder="Cast Member Name"/>
                                        <button type="button" onClick={() => removeCastMember(member.id)} className="text-gray-500 hover:text-red-500"><X size={20}/></button>
                                    </div>
                                ))}
                            </div>
                             <button type="button" onClick={addCastMember} className="text-sm text-theme-orange hover:text-orange-400 font-semibold flex items-center gap-2 mt-3"><Plus size={16}/> Add Another Cast Member</button>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Images Section */}
                        <div>
                             <h3 className="text-lg font-semibold mb-3 text-white">Images</h3>
                             <div className="space-y-4">
                                 <div>
                                     <label className="text-sm text-gray-400 mb-2 block">Poster Image (2:3)</label>
                                     <div className="w-full aspect-[2/3] rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 flex items-center justify-center text-gray-500 cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-colors relative">
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={e => handleFileChange(setPoster, e)} />
                                        {poster?.preview ? <Image src={poster.preview} alt="Poster Preview" layout="fill" className="object-cover rounded-lg"/> :
                                         existingPosterUrl ? <Image src={existingPosterUrl} alt="Current Poster" layout="fill" className="object-cover rounded-lg"/> :
                                         <div className="text-center"><ImagePlus className="w-8 h-8 mx-auto"/><p className="mt-1 text-xs">Click to upload</p></div>}
                                     </div>
                                 </div>
                                  <div>
                                     <label className="text-sm text-gray-400 mb-2 block">Backdrop Image (16:9)</label>
                                     <div className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 flex items-center justify-center text-gray-500 cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-colors relative">
                                         <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={e => handleFileChange(setBackdrop, e)}/>
                                         {backdrop?.preview ? <Image src={backdrop.preview} alt="Backdrop Preview" layout="fill" className="object-cover rounded-lg"/> :
                                         existingBackdropUrl ? <Image src={existingBackdropUrl} alt="Current Backdrop" layout="fill" className="object-cover rounded-lg"/> :
                                         <div className="text-center"><ImagePlus className="w-8 h-8 mx-auto"/><p className="mt-1 text-xs">Click to upload</p></div>}
                                     </div>
                                 </div>
                             </div>
                        </div>
                        {/* Video Files Section */}
                        <div>
                             <h3 className="text-lg font-semibold mb-3 text-white">Video Files</h3>
                             <div className="space-y-4">
                                 <div>
                                     <label className="text-sm text-gray-400 mb-2 block">Trailer File</label>
                                     {existingTrailerUrl && !trailer ? (
                                         <div className="flex items-center gap-2 text-sm text-gray-300 p-2 bg-[#1A202C] rounded-lg">
                                             <Video size={16} className="text-theme-orange" />
                                             <span className="truncate flex-1">{existingTrailerUrl.split('/').pop()}</span>
                                             <button type="button" onClick={() => setExistingTrailerUrl(undefined)} className="ml-auto text-gray-500 hover:text-red-500"><X size={16}/></button>
                                         </div>
                                     ) : (
                                         <input type="file" className="form-input w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-theme-orange hover:file:bg-orange-100" accept="video/*" onChange={e => handleSingleFileChange(setTrailer, e)}/>
                                     )}
                                 </div>
                                  <div>
                                     <label className="text-sm text-gray-400 mb-2 block">{contentType === 'movie' ? 'Main Movie File' : 'Episode Files'}</label>
                                     {existingMainFileUrl && mainFiles.length === 0 ? (
                                         <div className="flex items-center gap-2 text-sm text-gray-300 p-2 bg-[#1A202C] rounded-lg">
                                             <FileText size={16} className="text-theme-orange"/>
                                             <span className="truncate flex-1">{existingMainFileUrl.split('/').pop()}</span>
                                             <button type="button" onClick={() => setExistingMainFileUrl(undefined)} className="ml-auto text-gray-500 hover:text-red-500"><X size={16}/></button>
                                         </div>
                                     ) : (
                                         <input type="file" className="form-input w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-theme-orange hover:file:bg-orange-100" accept="video/*" multiple={contentType === 'series'} onChange={e => handleMultipleFilesChange(setMainFiles, e)}/>
                                     )}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                    <button type="submit" className="button-primary" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : (isEditMode ? 'Update Content' : 'Add to Upload Queue')}
                    </button>
                </div>
            </form>
            {/* The UploadProgress component is now in the layout, so it's not rendered here */}
        </div>
    );
}
