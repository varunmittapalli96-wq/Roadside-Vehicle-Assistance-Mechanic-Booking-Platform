'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, User, SERVICE_LABELS, STATUS_LABELS } from '@/lib/api';
import { MapPin, Phone, Clock, IndianRupee, ArrowLeft, XCircle } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

const STATUS_STEPS = ['pending', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed'];

export default function TrackPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRequest = useCallback(async () => {
    try {
      const data = await api.getRequest(id);
      setRequest(data);
    } catch {
      router.replace('/dashboard/user');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && id) {
      fetchRequest();
      const interval = setInterval(fetchRequest, 5000);
      return () => clearInterval(interval);
    }
  }, [user, id, fetchRequest]);

  const cancelRequest = async () => {
    if (confirm('Cancel this request?')) {
      await api.updateStatus(id, { status: 'cancelled', note: 'Cancelled by user' });
      fetchRequest();
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;
  if (!request) return null;

  const mechanic = typeof request.mechanicId === 'object' ? (request.mechanicId as User) : null;
  const currentStep = STATUS_STEPS.indexOf(request.status);

  return (
    <DashboardLayout navItems={navItems} title="Track Service">
      <Link href="/dashboard/user" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{SERVICE_LABELS[request.serviceType]}</h2>
              <p className="text-sm text-gray-500">Request #{request._id.slice(-6).toUpperCase()}</p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          {request.status !== 'cancelled' && request.status !== 'completed' && (
            <div className="mb-6">
              <div className="flex justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-orange-600 transition-all duration-500"
                  style={{ width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
                />
                {STATUS_STEPS.slice(0, -1).map((step, i) => (
                  <div key={step} className="relative flex flex-col items-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>{i + 1}</div>
                    <span className="text-[10px] text-gray-500 mt-1 text-center hidden sm:block w-16">
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-orange-600" />
              {request.location.address}
            </div>
            {request.estimatedArrivalMinutes && request.status !== 'pending' && request.status !== 'completed' && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-orange-600" />
                Estimated arrival: ~{request.estimatedArrivalMinutes} minutes
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <IndianRupee className="w-4 h-4 text-orange-600" />
              Estimated: ₹{request.estimatedPrice}
              {request.finalPrice && ` · Final: ₹${request.finalPrice}`}
            </div>
          </div>
        </div>

        {mechanic && (
          <div className="card">
            <h3 className="font-semibold mb-3">Assigned Mechanic</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{mechanic.name}</p>
                <p className="text-sm text-gray-500">{mechanic.profile?.businessName}</p>
                {mechanic.profile?.rating ? (
                  <p className="text-sm text-yellow-600">★ {mechanic.profile.rating} ({mechanic.profile.totalRatings} reviews)</p>
                ) : null}
              </div>
              <a href={`tel:${mechanic.phone}`} className="btn-primary flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" /> Call
              </a>
            </div>
          </div>
        )}

        {request.status === 'pending' && (
          <div className="card bg-yellow-50 border-yellow-200">
            <p className="text-yellow-800 text-sm">
              Waiting for a mechanic to accept your request. This usually takes a few minutes.
            </p>
            <button onClick={cancelRequest} className="btn-danger mt-3 flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4" /> Cancel Request
            </button>
          </div>
        )}

        {request.statusHistory && request.statusHistory.length > 0 && (
          <div className="card">
            <h3 className="font-semibold mb-3">Status Timeline</h3>
            <div className="space-y-3">
              {[...request.statusHistory].reverse().map((entry, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{STATUS_LABELS[entry.status] || entry.status}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(entry.timestamp).toLocaleString()}
                      {entry.note && ` · ${entry.note}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
