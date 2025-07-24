/*
 * FILE: src/contexts/UploadContext.tsx
 *
 * INSTRUCTIONS: Ensure your Upload Context file matches this version.
 * This file defines and provides the global state for the upload queue.
 */
"use client";

import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

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

interface UploadContextType {
    queue: UploadFile[];
    setQueue: Dispatch<SetStateAction<UploadFile[]>>;
    addToQueue: (files: UploadFile[]) => void;
    retryUpload: (fileId: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
    const [queue, setQueue] = useState<UploadFile[]>([]);

    const addToQueue = (files: UploadFile[]) => {
        setQueue(prev => [...prev, ...files]);
    };
    
    const retryUpload = (fileId: string) => {
        setQueue(prev => prev.map(f => f.id === fileId ? { ...f, status: 'queued', progress: 0 } : f));
    };

    return (
        <UploadContext.Provider value={{ queue, setQueue, addToQueue, retryUpload }}>
            {children}
        </UploadContext.Provider>
    );
}

export function useUploadContext() {
    const context = useContext(UploadContext);
    if (context === undefined) {
        throw new Error('useUploadContext must be used within an UploadProvider');
    }
    return context;
}
