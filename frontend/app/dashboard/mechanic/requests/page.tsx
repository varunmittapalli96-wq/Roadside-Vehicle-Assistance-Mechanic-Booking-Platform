'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner, EmptyState } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import { MapPin, Clock, IndianRupee, CheckCircle } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/mechanic' },
  { label: 'Incoming Requests', href: '/dashboard/mechanic/requests' },
  { label: 'My Jobs', href: '/dashboard/mechanic/jobs' },
  { label: 'Earnings', href: '/dashboard/mechanic/earnings' },
  { label: 'Profile', href: '/dashboard/mechanic/profile' },
];

export default function IncomingRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mechanic')) router.replace('/login');
  }, [user, authLoading, router]);

  const load = () => api.getPendingRequests().then(setRequests).finally(() => setLoading(false));

  useEffect(() => {
    if (user?.role === 'mechanic') {
      load();
      const interval = setInterval(load, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const accept = async (id: string) => {
    setAccepting(id);
    try {
      await api.acceptRequest(id);
      router.push(`/dashboard/mechanic/jobs/${id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to accept');
    } finally {
      setAccepting(null);
    }
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Incoming Requests">
      {loading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <EmptyState message="No pending requests. Check back soon." />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const userInfo = typeof req.userId === 'object' ? req.userId : null;
            const vehicle = typeof req.vehicleId === 'object' ? req.vehicleId : null;
            return (
              <div key={req._id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{SERVICE_LABELS[req.serviceType]}</h3>
                    {userInfo && <p className="text-sm text-gray-600">Customer: {userInfo.name} · {userInfo.phone}</p>}
                    {vehicle && <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model} · {vehicle.licensePlate}</p>}
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.location.address}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(req.createdAt).toLocaleTimeString()}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" /> ₹{req.estimatedPrice}</span>
                    </div>
                    {req.description && <p className="text-sm text-gray-500 mt-2 italic">&quot;{req.description}&quot;</p>}
                  </div>
                  <button
                    onClick={() => accept(req._id)}
                    disabled={!user.isVerified || accepting === req._id}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {accepting === req._id ? 'Accepting...' : 'Accept Job'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
