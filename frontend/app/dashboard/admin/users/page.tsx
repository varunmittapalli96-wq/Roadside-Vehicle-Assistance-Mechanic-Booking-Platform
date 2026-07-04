'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner, EmptyState } from '@/components/ui';
import { api, User } from '@/lib/api';
import { User as UserIcon, Mail, Phone } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/admin' },
  { label: 'Verify Partners', href: '/dashboard/admin/verify' },
  { label: 'Live Requests', href: '/dashboard/admin/requests' },
  { label: 'Users', href: '/dashboard/admin/users' },
];

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.getAllUsers().then(setUsers).finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Registered Users">
      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <EmptyState message="No users registered yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div key={u._id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <span className="badge bg-blue-100 text-blue-700">Vehicle Owner</span>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {u.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {u.phone}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">Joined recently</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
