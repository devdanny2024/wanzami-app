import { Suspense } from 'react';
import { UploadProvider } from '@/contexts/UploadContext';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'; // Import the new client component

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UploadProvider>
      {/* Suspense is needed because our client layout uses useSearchParams */}
      <Suspense fallback={<div className="bg-[#0B0C10] min-h-screen text-white flex items-center justify-center">Loading Admin Panel...</div>}>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </Suspense>
    </UploadProvider>
  );
}