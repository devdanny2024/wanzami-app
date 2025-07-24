"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X, Loader2, UploadCloud, RotateCw } from 'lucide-react';
import { useUploadContext } from '@/contexts/UploadContext';

interface UploadProgressProps {
    secretKey: string;
}

export default function UploadProgress({ secretKey }: UploadProgressProps) {
    const { queue, setQueue, retryUpload } = useUploadContext();
    const [isExpanded, setIsExpanded] = useState(true);

    // This effect processes the actual file uploads one by one
    useEffect(() => {
        const processQueue = async () => {
            const fileToUpload = queue.find(f => f.status === 'queued');
            if (!fileToUpload) return;

            setQueue(prev => prev.map(f => f.id === fileToUpload.id ? { ...f, status: 'uploading' } : f));

            try {
                await new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', fileToUpload.signedUrl, true);
                    xhr.setRequestHeader('Content-Type', fileToUpload.file.type);

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = (event.loaded / event.total) * 100;
                            setQueue(prev => prev.map(f => f.id === fileToUpload.id ? { ...f, progress: percentComplete } : f));
                        }
                    };
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            setQueue(prev => prev.map(f => f.id === fileToUpload.id ? { ...f, status: 'complete', progress: 100 } : f));
                            resolve();
                        } else {
                            reject(new Error(`Upload failed with status: ${xhr.status}`));
                        }
                    };
                    xhr.onerror = () => reject(new Error('Network error during upload.'));
                    xhr.send(fileToUpload.file);
                });
            } catch (error) {
                console.error('Upload error:', error);
                setQueue(prev => prev.map(f => f.id === fileToUpload.id ? { ...f, status: 'error' } : f));
            }
        };

        processQueue();
    }, [queue, setQueue]);

    // This effect finalizes the content entry in the database once all its files are uploaded
    useEffect(() => {
        const completedContent = new Map<string, any[]>();
        queue.forEach(file => {
            if (file.status === 'complete') {
                if (!completedContent.has(file.contentId)) completedContent.set(file.contentId, []);
                completedContent.get(file.contentId)!.push(file);
            }
        });

        completedContent.forEach(async (files, contentId) => {
            const allFilesInContent = queue.filter(f => f.contentId === contentId);
            const allComplete = allFilesInContent.every(f => f.status === 'complete');
            const hasBeenFinalized = allFilesInContent.every(f => f.progress === -1); // Use progress as a flag

            if (allComplete && !hasBeenFinalized) {
                try {
                    await fetch('/api/admin/finalize-upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contentId, secretKey }),
                    });
                     // Mark as finalized to prevent multiple calls
                    setQueue(prev => prev.map(f => f.contentId === contentId ? {...f, progress: -1} : f));
                } catch (error) {
                    console.error("Finalization failed:", error);
                }
            }
        });
    }, [queue, setQueue, secretKey]);

    const activeQueue = queue.filter(f => f.progress !== -1);
    if (activeQueue.length === 0) return null;

    const overallProgress = activeQueue.length > 0 ? activeQueue.reduce((acc, f) => acc + f.progress, 0) / activeQueue.length : 0;
    const isUploading = activeQueue.some(f => f.status === 'uploading');
    const hasError = activeQueue.some(f => f.status === 'error');

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-[#1A202C] border border-gray-700 rounded-lg shadow-2xl z-50">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-3 bg-gray-800/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    {isUploading ? <Loader2 className="animate-spin" size={20}/> : hasError ? <AlertCircle size={20} className="text-red-500" /> : <UploadCloud size={20}/>}
                    <span className="text-sm font-semibold">Upload Progress</span>
                </div>
                 <div className="relative w-7 h-7">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-600" strokeWidth="2"></circle>
                        <circle
                            cx="18" cy="18" r="16" fill="none"
                            className="stroke-theme-orange transition-all duration-300"
                            strokeWidth="2" strokeDasharray={`${overallProgress}, 100`} strokeLinecap="round"
                        ></circle>
                    </svg>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold">
                        {Math.round(overallProgress)}%
                    </span>
                </div>
            </button>
            {isExpanded && (
                <div className="p-3 max-h-60 overflow-y-auto">
                    <ul className="space-y-2">
                        {activeQueue.map(item => (
                            <li key={item.id} className="text-xs">
                                <div className="flex items-center justify-between">
                                    <p className="truncate w-48">{item.file.name}</p>
                                    <div className="flex items-center gap-2">
                                        {item.status === 'complete' && <CheckCircle size={14} className="text-green-500"/>}
                                        {item.status === 'error' && (
                                            <button onClick={() => retryUpload(item.id)} title="Retry Upload" className="text-gray-400 hover:text-white">
                                                <RotateCw size={14} />
                                            </button>
                                        )}
                                        {item.status === 'uploading' && <Loader2 size={14} className="animate-spin"/>}
                                        {item.status !== 'error' && <span className="text-gray-400 w-8 text-right">{Math.round(item.progress)}%</span>}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                                    <div className={`h-1.5 rounded-full transition-all duration-300 ${item.status === 'error' ? 'bg-red-500' : 'bg-theme-orange'}`} style={{ width: `${item.progress}%` }}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
