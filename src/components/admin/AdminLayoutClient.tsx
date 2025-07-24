"use client";


import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { UploadProvider, useUploadContext } from '@/contexts/UploadContext';
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import UploadProgress from '@/components/admin/UploadProgress';

// This component contains the actual layout, allowing it to use client-side hooks.
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { queue } = useUploadContext();
  const searchParams = useSearchParams();
  const secretKey = searchParams.get('secret') || '';

  return (
    <div className="bg-[#0B0C10] text-gray-200 min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      {/* The UploadProgress component is rendered here, outside of individual pages */}
      {queue.length > 0 && <UploadProgress secretKey={secretKey} />}
    </div>
  );
}

// The main layout provides the context and a Suspense boundary for the client components.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UploadProvider>
      <Suspense fallback={<div className="bg-[#0B0C10] min-h-screen text-white flex items-center justify-center">Loading Admin...</div>}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </Suspense>
    </UploadProvider>
  );
}
