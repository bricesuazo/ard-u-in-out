'use client';

import {
  ClerkLoading,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';

export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <h3 className="font-bold">ARD U IN/Out</h3>
      <div>
        <SignedIn>
          <Button asChild size="sm">
            <SignOutButton>Log out</SignOutButton>
          </Button>
        </SignedIn>
        <SignedOut>
          <Button asChild size="sm">
            <SignInButton mode="modal">Sign in</SignInButton>
          </Button>
        </SignedOut>
        <ClerkLoading>
          <div className="px-6 py-2">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </ClerkLoading>
      </div>
    </header>
  );
}
