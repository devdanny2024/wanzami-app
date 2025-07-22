import { cookies } from 'next/headers';

export async function getUserSession() {
  const cookieStore = cookies();
  const idToken = cookieStore.get('IdToken');

  // A simple check to see if the user is authenticated.
  // In a real app, you might decode the token to get user info.
  const isLoggedIn = !!idToken;

  return { isLoggedIn };
}
