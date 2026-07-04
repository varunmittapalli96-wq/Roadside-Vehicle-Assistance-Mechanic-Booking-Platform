'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import { AlertCircle, Car, Plus, History } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'user') {
      api.getRequests().then(setRequests).finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  const active = requests.filter((r) =>
    ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'].includes(r.status)
  );
  const completed = requests.filter((r) => r.status === 'completed');

  return (
    <DashboardLayout navItems={navItems} title="Dashboard">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-1">Need roadside assistance?</h2>
              <p className="text-orange-100 mb-4">
                Request help and connect with verified mechanics near your location.
              </p>
              <Link
                href="/dashboard/user/request"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Request Assistance
              </Link>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500">Active Requests</p>
            <p className="text-3xl font-bold text-orange-600">{active.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Completed Services</p>
            <p className="text-3xl font-bold text-green-600">{completed.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : active.length > 0 ? (
          <div>
            <h3 className="font-semibold text-lg mb-4">Active Service Requests</h3>
            <div className="space-y-3">
              {active.map((req) => (
                <Link
                  key={req._id}
                  href={`/dashboard/user/track/${req._id}`}
                  className="card flex items-center justify-between hover:shadow-md transition-shadow block"
                >
                  <div>
                    <p className="font-medium">{SERVICE_LABELS[req.serviceType]}</p>
                    <p className="text-sm text-gray-500">{req.location.address}</p>
                    {req.estimatedArrivalMinutes && req.status !== 'pending' && (
                      <p className="text-sm text-orange-600 mt-1">
                        ETA: ~{req.estimatedArrivalMinutes} min
                      </p>
                    )}
                  </div>
                  <StatusBadge status={req.status} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="card text-center py-8">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active requests. You&apos;re all set!</p>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Recent History</h3>
              <Link href="/dashboard/user/history" className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                <History className="w-4 h-4" /> View all
              </Link>
            </div>
            <div className="space-y-3">
              {completed.slice(0, 3).map((req) => (
                <div key={req._id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium">{SERVICE_LABELS[req.serviceType]}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString()} · ₹{req.finalPrice || req.estimatedPrice}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
