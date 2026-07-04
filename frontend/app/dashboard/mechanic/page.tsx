'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner, EmptyState } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import { Bell, Briefcase, IndianRupee, MapPin, CheckCircle } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/mechanic' },
  { label: 'Incoming Requests', href: '/dashboard/mechanic/requests' },
  { label: 'My Jobs', href: '/dashboard/mechanic/jobs' },
  { label: 'Earnings', href: '/dashboard/mechanic/earnings' },
  { label: 'Profile', href: '/dashboard/mechanic/profile' },
];

export default function MechanicDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<ServiceRequest[]>([]);
  const [jobs, setJobs] = useState<ServiceRequest[]>([]);
  const [earnings, setEarnings] = useState({ totalEarnings: 0, totalJobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mechanic')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'mechanic') {
      Promise.all([
        api.getPendingRequests(),
        api.getMechanicJobs(),
        api.getEarnings(),
      ]).then(([p, j, e]) => {
        setPending(p);
        setJobs(j);
        setEarnings(e);
      }).finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  const activeJobs = jobs.filter((j) =>
    ['accepted', 'en_route', 'arrived', 'in_progress'].includes(j.status)
  );

  return (
    <DashboardLayout navItems={navItems} title="Mechanic Dashboard">
      {!user.isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-yellow-800 text-sm">
          Your account is pending verification by admin. You won&apos;t be able to accept jobs until verified.
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold">{pending.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Active Jobs</p>
              <p className="text-2xl font-bold">{activeJobs.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold">₹{earnings.totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {activeJobs.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Active Jobs</h3>
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <a key={job._id} href={`/dashboard/mechanic/jobs/${job._id}`} className="card block hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{SERVICE_LABELS[job.serviceType]}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location.address}
                        </p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-3">Latest Incoming Requests</h3>
            {pending.length === 0 ? (
              <EmptyState message="No pending requests at the moment." />
            ) : (
              <div className="space-y-3">
                {pending.slice(0, 5).map((req) => (
                  <div key={req._id} className="card flex items-center justify-between">
                    <div>
                      <p className="font-medium">{SERVICE_LABELS[req.serviceType]}</p>
                      <p className="text-sm text-gray-500">{req.location.address}</p>
                      <p className="text-sm text-orange-600">₹{req.estimatedPrice}</p>
                    </div>
                    <a href="/dashboard/mechanic/requests" className="btn-primary text-sm">View</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
