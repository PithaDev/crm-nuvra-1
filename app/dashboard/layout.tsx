'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem('nuvra_auth');
    if (!auth) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
