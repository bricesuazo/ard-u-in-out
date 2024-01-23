import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { userId } = auth();

  if (!userId) redirect('/');

  return <div>{userId}</div>;
}
