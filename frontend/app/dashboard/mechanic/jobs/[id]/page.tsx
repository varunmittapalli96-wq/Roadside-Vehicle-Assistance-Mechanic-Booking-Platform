'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, User, SERVICE_LABELS } from '@/lib/api';
import { MapPin, Phone, ArrowLeft, Navigation } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/mechanic' },
  { label: 'Incoming Requests', href: '/dashboard/mechanic/requests' },
  { label: 'My Jobs', href: '/dashboard/mechanic/jobs' },
  { label: 'Earnings', href: '/dashboard/mechanic/earnings' },
  { label: 'Profile', href: '/dashboard/mechanic/profile' },
];

const NEXT_STATUS: Record<string, { status: string; label: string }> = {
  accepted: { status: 'en_route', label: 'Start Navigation' },
  en_route: { status: 'arrived', label: 'Mark Arrived' },
  arrived: { status: 'in_progress', label: 'Start Service' },
  in_progress: { status: 'completed', label: 'Complete Job' },
};

export default function JobDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');

  const fetchJob = useCallback(async () => {
    try {
      const data = await api.getRequest(id);
      setJob(data);
      setFinalPrice(String(data.finalPrice || data.estimatedPrice));
    } catch {
      router.replace('/dashboard/mechanic/jobs');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mechanic')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && id) fetchJob();
  }, [user, id, fetchJob]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      let mechanicLocation;
      if (status === 'en_route' && navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        mechanicLocation = {
          type: 'Point',
          coordinates: [pos.coords.longitude, pos.coords.latitude],
        };
        await api.updateMechanicLocation(
          [pos.coords.longitude, pos.coords.latitude]
        );
      }
      const body: Record<string, unknown> = { status, note: `Status updated to ${status}` };
      if (mechanicLocation) body.mechanicLocation = mechanicLocation;
      if (status === 'completed') body.finalPrice = parseFloat(finalPrice);
      await api.updateStatus(id, body);
      fetchJob();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;
  if (!job) return null;

  const customer = typeof job.userId === 'object' ? (job.userId as User) : null;
  const vehicle = typeof job.vehicleId === 'object' ? job.vehicleId : null;
  const next = NEXT_STATUS[job.status];

  return (
    <DashboardLayout navItems={navItems} title="Job Details">
      <Link href="/dashboard/mechanic/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{SERVICE_LABELS[job.serviceType]}</h2>
            <StatusBadge status={job.status} />
          </div>

          {customer && (
            <div className="mb-4">
              <p className="font-medium">{customer.name}</p>
              <a href={`tel:${customer.phone}`} className="text-sm text-orange-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {customer.phone}
              </a>
            </div>
          )}

          {vehicle && (
            <p className="text-sm text-gray-600 mb-2">
              Vehicle: {vehicle.make} {vehicle.model} · {vehicle.licensePlate}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            {job.location.address}
          </div>

          {job.description && (
            <p className="text-sm text-gray-500 italic mb-4">&quot;{job.description}&quot;</p>
          )}

          <p className="text-lg font-bold">₹{job.estimatedPrice} estimated</p>
        </div>

        {next && (
          <div className="card space-y-4">
            {job.status === 'in_progress' && (
              <div>
                <label className="block text-sm font-medium mb-1">Final Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                />
              </div>
            )}
            <button
              onClick={() => updateStatus(next.status)}
              disabled={updating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {next.status === 'en_route' && <Navigation className="w-4 h-4" />}
              {updating ? 'Updating...' : next.label}
            </button>
          </div>
        )}

        {job.status === 'completed' && (
          <div className="card bg-green-50 border-green-200 text-green-800 text-center py-6">
            <p className="font-semibold">Job Completed!</p>
            <p className="text-sm mt-1">Final amount: ₹{job.finalPrice || job.estimatedPrice}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
