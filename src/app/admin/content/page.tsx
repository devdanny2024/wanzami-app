"use client";

import { Suspense } from 'react';
import ContentClientPage from "@/components/admin/ContentClientPage";

// This is the Server Component wrapper
export default function AdminContentPage() {
    return (
        <Suspense fallback={<div className="p-8 text-white">Loading Content...</div>}>
            <ContentClientPage />
        </Suspense>
    );
}
