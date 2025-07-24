import AdminUploadPage from "@/components/admin/AdminUploadPage";

// Define the shape of the props this page receives from Next.js
interface EditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ secret?: string }>;
}

// This is a server-side function to fetch a single movie's data
async function getMovieData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/movies/${id}`, {
    cache: 'no-store', // Always fetch fresh data when editing
  });

  if (!res.ok) {
    throw new Error('Failed to fetch movie data');
  }
  return res.json();
}

// This is the main Server Component for the Edit Page
export default async function EditContentPage({ params, searchParams }: EditPageProps) {
  // We must await the params objects as per Next.js 15
  const { id } = await params;
  const { secret } = await searchParams;
  const movieData = await getMovieData(id);

  if (!movieData) {
    return <div className="p-8 text-white">Movie not found or failed to load.</div>;
  }

  return (
    <div>
      {/*
       * We render our reusable form component, passing the fetched movie data
       * to pre-fill the form, and the secret key for API requests.
      */}
      <AdminUploadPage initialData={movieData} secretKey={secret || ''} />
    </div>
  );
}
