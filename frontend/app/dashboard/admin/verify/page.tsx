'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner, EmptyState } from '@/components/ui';
import { api, User } from '@/lib/api';
import { CheckCircle, XCircle, Shield } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/admin' },
  { label: 'Verify Partners', href: '/dashboard/admin/verify' },
  { label: 'Live Requests', href: '/dashboard/admin/requests' },
  { label: 'Users', href: '/dashboard/admin/users' },
];

export default function VerifyPartnersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mechanics, setMechanics] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/login');
  }, [user, authLoading, router]);

  const load = () => api.getPendingMechanics().then(setMechanics).finally(() => setLoading(false));

  useEffect(() => {
    if (user?.role === 'admin') load();
  }, [user]);

  const verify = async (id: string) => {
    setActionId(id);
    await api.verifyMechanic(id);
    load();
    setActionId(null);
  };

  const reject = async (id: string) => {
    if (!confirm('Reject this application?')) return;
    setActionId(id);
    await api.rejectMechanic(id);
    load();
    setActionId(null);
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Verify Partners">
      {loading ? (
        <LoadingSpinner />
      ) : mechanics.length === 0 ? (
        <EmptyState message="No pending partner verifications." />
      ) : (
        <div className="space-y-4">
          {mechanics.map((m) => (
            <div key={m._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{m.profile?.businessName || m.name}</p>
                    <p className="text-sm text-gray-500">{m.name} · {m.email} · {m.phone}</p>
                    <p className="text-sm text-gray-500">License: {m.profile?.licenseNumber}</p>
                    {m.profile?.bio && <p className="text-sm text-gray-600 mt-1">{m.profile.bio}</p>}
                    {m.profile?.services && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {m.profile.services.map((s) => (
                          <span key={s} className="badge bg-gray-100 text-gray-700 capitalize">{s.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => verify(m._id)}
                    disabled={actionId === m._id}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Verify
                  </button>
                  <button
                    onClick={() => reject(m._id)}
                    disabled={actionId === m._id}
                    className="btn-danger flex items-center gap-2 text-sm"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
