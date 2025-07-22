import { getCurrentUser } from '@/lib/auth';
import AccountPageClient from './AccountPageClient';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const user = await getCurrentUser();

  // If for some reason we can't get the user, redirect to login
  if (!user) {
    redirect('/login');
  }

  return <AccountPageClient user={user} />;
}
