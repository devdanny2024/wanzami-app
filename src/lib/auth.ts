import { cookies } from 'next/headers';

export async function getUserSession() {
  // In Next.js 15, the cookies() object itself is a promise.
  // We must await it before we can access individual cookies.
  const cookieStore = await cookies(); 
  const idToken = cookieStore.get('IdToken');

  const isLoggedIn = !!idToken;

  return { isLoggedIn };
}
