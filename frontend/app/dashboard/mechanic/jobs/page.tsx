'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner, EmptyState } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import { MapPin, IndianRupee } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/mechanic' },
  { label: 'Incoming Requests', href: '/dashboard/mechanic/requests' },
  { label: 'My Jobs', href: '/dashboard/mechanic/jobs' },
  { label: 'Earnings', href: '/dashboard/mechanic/earnings' },
  { label: 'Profile', href: '/dashboard/mechanic/profile' },
];

export default function MechanicJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mechanic')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'mechanic') {
      api.getMechanicJobs().then(setJobs).finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="My Jobs">
      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <EmptyState message="No jobs yet. Accept incoming requests to get started." />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <a
              key={job._id}
              href={`/dashboard/mechanic/jobs/${job._id}`}
              className="card flex items-center justify-between hover:shadow-md transition-shadow block"
            >
              <div>
                <p className="font-medium">{SERVICE_LABELS[job.serviceType]}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.location.address}
                </p>
                <p className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={job.status} />
                <p className="text-sm font-medium mt-1 flex items-center justify-end gap-0.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {job.finalPrice || job.estimatedPrice}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
