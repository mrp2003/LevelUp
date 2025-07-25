"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check if current route is an auth page
  const isAuthPage = pathname?.startsWith('/auth/');

  // For auth pages, render without protection or navbar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For all other pages, require authentication and show navbar
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pb-4 md:pb-20">{children}</main>
      </div>
    </ProtectedRoute>
  );
}