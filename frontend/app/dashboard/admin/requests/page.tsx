'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner, EmptyState } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/admin' },
  { label: 'Verify Partners', href: '/dashboard/admin/verify' },
  { label: 'Live Requests', href: '/dashboard/admin/requests' },
  { label: 'Users', href: '/dashboard/admin/users' },
];

export default function AdminRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/login');
  }, [user, authLoading, router]);

  const load = () => api.getAllRequests().then(setRequests).finally(() => setLoading(false));

  useEffect(() => {
    if (user?.role === 'admin') {
      load();
      const interval = setInterval(load, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const resolve = async (id: string) => {
    const note = prompt('Resolution note:');
    if (note !== null) {
      await api.resolveRequest(id, 'cancelled', note);
      load();
    }
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Live Service Requests">
      {loading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <EmptyState message="No service requests yet." />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const userName = typeof req.userId === 'object' ? req.userId.name : 'Unknown';
            const mechanicName = typeof req.mechanicId === 'object' ? req.mechanicId?.name : 'Unassigned';
            return (
              <div key={req._id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{SERVICE_LABELS[req.serviceType]}</p>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-sm text-gray-500">User: {userName} · Mechanic: {mechanicName}</p>
                    <p className="text-sm text-gray-500">{req.location.address}</p>
                    <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()} · ₹{req.estimatedPrice}</p>
                  </div>
                  {!['completed', 'cancelled'].includes(req.status) && (
                    <button onClick={() => resolve(req._id)} className="btn-danger text-sm whitespace-nowrap">
                      Resolve Dispute
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
