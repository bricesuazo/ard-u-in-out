'use client';

import { SignInButton, UserButton } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';
import { LayoutDashboard, Loader2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export default function Header() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { setTheme, theme } = useTheme();

  return (
    <header className="flex justify-between items-center">
      <Link href="/">
        <h3 className="font-bold">ARD U IN/Out</h3>
      </Link>
      <div className="h-9 flex gap-x-2 items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
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
            <Button asChild size="icon" className="h-9 w-9 sm:hidden">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </div>
        )}
      </div>
    </header>
  );
}
