'use client';

import { SignInButton, UserButton } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export default function Header() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <header className="flex justify-between items-center">
      <Link href="/">
        <h3 className="font-bold">ARD U IN/Out</h3>
      </Link>
      <div className="h-9">
        {isLoading ? (
          <div className="p-2">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !isAuthenticated ? (
          <Button asChild size="sm">
            <SignInButton mode="modal">Sign in</SignInButton>
          </Button>
        ) : (
          <div className="flex items-center gap-x-2">
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </div>
        )}
      </div>
    </header>
  );
}
