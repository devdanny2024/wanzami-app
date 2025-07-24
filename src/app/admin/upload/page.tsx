/*
 * FILE: src/app/admin/upload/page.tsx
 *
 * INSTRUCTIONS: This is the page component for creating new content.
 * Its only job is to get the secret key from the URL and render our
 * main AdminUploadPage form component without any initial data.
 */
import AdminUploadPage from "@/components/admin/AdminUploadPage";

// Define the shape of the props for this page
interface NewUploadPageProps {
  searchParams: Promise<{ secret?: string }>;
}

export default async function NewUploadPage({ searchParams }: NewUploadPageProps) {
  // As per Next.js 15, we must await the searchParams object
  const { secret } = await searchParams;

  return (
    <div>
      {/*
       * We render our main form component. We pass the secretKey
       * but we DO NOT pass initialData, so the component knows
       * it is in "create new" mode.
      */}
      <AdminUploadPage secretKey={secret || ''} />
    </div>
  );
}
