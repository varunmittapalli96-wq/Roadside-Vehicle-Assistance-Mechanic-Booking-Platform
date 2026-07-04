'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import { IndianRupee, Briefcase } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/mechanic' },
  { label: 'Incoming Requests', href: '/dashboard/mechanic/requests' },
  { label: 'My Jobs', href: '/dashboard/mechanic/jobs' },
  { label: 'Earnings', href: '/dashboard/mechanic/earnings' },
  { label: 'Profile', href: '/dashboard/mechanic/profile' },
];

export default function EarningsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<{ totalEarnings: number; totalJobs: number; recentJobs: ServiceRequest[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mechanic')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'mechanic') {
      api.getEarnings().then(setData).finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Earnings">
      {loading ? (
        <LoadingSpinner />
      ) : data ? (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card bg-gradient-to-br from-green-600 to-green-700 text-white">
              <IndianRupee className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-green-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold">₹{data.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="card">
              <Briefcase className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-500">Completed Jobs</p>
              <p className="text-3xl font-bold">{data.totalJobs}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Recent Completed Jobs</h3>
            {data.recentJobs.length === 0 ? (
              <p className="text-gray-500 text-sm">No completed jobs yet.</p>
            ) : (
              <div className="space-y-3">
                {data.recentJobs.map((job) => (
                  <div key={job._id} className="card flex items-center justify-between">
                    <div>
                      <p className="font-medium">{SERVICE_LABELS[job.serviceType]}</p>
                      <p className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{job.finalPrice || job.estimatedPrice}</p>
                      <StatusBadge status={job.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
