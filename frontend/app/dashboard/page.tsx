'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LoadingSpinner } from '@/components/ui';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    const paths: Record<string, string> = {
      user: '/dashboard/user',
      mechanic: '/dashboard/mechanic',
      admin: '/dashboard/admin',
    };
    router.replace(paths[user.role] || '/dashboard/user');
  }, [user, loading, router]);

  return <LoadingSpinner />;
}
