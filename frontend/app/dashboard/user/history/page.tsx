'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, StarRating, LoadingSpinner, EmptyState } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import { MapPin, Clock, Star, IndianRupee } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'user') {
      api.getRequests().then(setRequests).finally(() => setLoading(false));
    }
  }, [user]);

  const handleRate = async (id: string) => {
    await api.rateRequest(id, rating, feedback);
    setRatingId(null);
    const updated = await api.getRequests();
    setRequests(updated);
  };

  if (authLoading || !user) return <LoadingSpinner />;

  const completed = requests.filter((r) => ['completed', 'cancelled'].includes(r.status));

  return (
    <DashboardLayout navItems={navItems} title="Service History">
      {loading ? (
        <LoadingSpinner />
      ) : completed.length === 0 ? (
        <EmptyState message="No service history yet." />
      ) : (
        <div className="space-y-4">
          {completed.map((req) => {
            const vehicle = typeof req.vehicleId === 'object' ? req.vehicleId : null;
            const mechanic = typeof req.mechanicId === 'object' ? req.mechanicId : null;
            return (
              <div key={req._id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{SERVICE_LABELS[req.serviceType]}</h3>
                      <StatusBadge status={req.status} />
                    </div>
                    {vehicle && (
                      <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model} · {vehicle.licensePlate}</p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {req.location.address}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Clock className="w-3.5 h-3.5" /> {new Date(req.createdAt).toLocaleString()}
                    </div>
                    {mechanic && (
                      <p className="text-sm text-gray-600 mt-1">Mechanic: {mechanic.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                      <IndianRupee className="w-4 h-4" />
                      {req.finalPrice || req.estimatedPrice}
                    </div>
                    {req.rating ? (
                      <StarRating rating={req.rating} />
                    ) : req.status === 'completed' ? (
                      ratingId === req._id ? (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-1 justify-end">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => setRating(s)}>
                                <Star className={`w-5 h-5 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              </button>
                            ))}
                          </div>
                          <input
                            className="input-field text-sm"
                            placeholder="Feedback (optional)"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                          <button onClick={() => handleRate(req._id)} className="btn-primary text-sm w-full">Submit</button>
                        </div>
                      ) : (
                        <button onClick={() => setRatingId(req._id)} className="text-sm text-orange-600 hover:underline mt-2">
                          Rate Service
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
