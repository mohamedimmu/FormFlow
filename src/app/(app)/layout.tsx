'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { Logo } from '@/components/icons';

function AuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Logo className="h-12 w-12 animate-pulse text-primary" />
                    <p className="text-muted-foreground">Loading application...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}


export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
        <SidebarProvider>
            <SidebarNav />
            <SidebarInset>
                <Header />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    </AuthGuard>
  );
}
