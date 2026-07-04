'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StarRating, LoadingSpinner } from '@/components/ui';
import { api, Vehicle, NearbyMechanic, SERVICE_LABELS } from '@/lib/api';
import { MapPin, Navigation, Star, Clock, IndianRupee, Wrench } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

const SERVICE_TYPES = Object.keys(SERVICE_LABELS);

export default function RequestHelpPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mechanics, setMechanics] = useState<NearbyMechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lng: number; lat: number; address: string } | null>(null);

  const [form, setForm] = useState({
    vehicleId: '',
    serviceType: '',
    description: '',
    mechanicId: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'user') {
      api.getVehicles().then(setVehicles).finally(() => setLoading(false));
    }
  }, [user]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          });
        },
        () => {
          setLocation({ lng: 77.5946, lat: 12.9716, address: 'MG Road, Bangalore (default)' });
        }
      );
    } else {
      setLocation({ lng: 77.5946, lat: 12.9716, address: 'MG Road, Bangalore (default)' });
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const findMechanics = async () => {
    if (!location || !form.serviceType) return;
    setLoading(true);
    try {
      const nearby = await api.getNearbyMechanics(location.lng, location.lat, form.serviceType);
      setMechanics(nearby);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find mechanics');
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async (mechanicId?: string) => {
    if (!location) return;
    setSubmitting(true);
    setError('');
    try {
      const req = await api.createRequest({
        vehicleId: form.vehicleId,
        serviceType: form.serviceType,
        description: form.description,
        location: { type: 'Point', coordinates: [location.lng, location.lat], address: location.address },
        mechanicId: mechanicId || form.mechanicId || undefined,
      });
      router.push(`/dashboard/user/track/${req._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Request Assistance">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        {step === 1 && (
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Select Service Type</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {SERVICE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, serviceType: type })}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    form.serviceType === type ? 'border-orange-600 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <Wrench className="w-5 h-5 text-orange-600 mb-2" />
                  <p className="font-medium text-sm">{SERVICE_LABELS[type]}</p>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select Vehicle</label>
              {vehicles.length === 0 ? (
                <p className="text-sm text-red-600">Please add a vehicle first.</p>
              ) : (
                <select
                  className="input-field"
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                  required
                >
                  <option value="">Choose vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>{v.make} {v.model} - {v.licensePlate}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Describe the issue (optional)</label>
              <textarea
                className="input-field"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., Engine won't start, flat tire on highway..."
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!form.serviceType || !form.vehicleId}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Confirm Location</h2>
            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{location?.address || 'Detecting location...'}</p>
                <p className="text-sm text-gray-500 mt-1">Your breakdown location</p>
              </div>
            </div>
            <button onClick={detectLocation} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" /> Refresh Location
            </button>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button onClick={findMechanics} disabled={!location || loading} className="btn-primary flex-1">
                {loading ? 'Searching...' : 'Find Nearby Mechanics'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nearby Mechanics</h2>
              <button onClick={() => setStep(2)} className="text-sm text-orange-600 hover:underline">Back</button>
            </div>

            {mechanics.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500 mb-4">No mechanics found nearby. You can still submit a request.</p>
                <button onClick={() => submitRequest()} disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Request Anyway'}
                </button>
              </div>
            ) : (
              <>
                {mechanics.map((m) => (
                  <div key={m._id} className="card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{m.businessName || m.name}</p>
                        <p className="text-sm text-gray-500">{m.name}</p>
                        <StarRating rating={m.rating} />
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {m.distance} km</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{m.estimatedArrivalMinutes} min</span>
                          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {m.totalJobs} jobs</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {m.pricing && (
                          <p className="text-xl font-bold flex items-center justify-end gap-1">
                            <IndianRupee className="w-4 h-4" />{m.pricing}
                          </p>
                        )}
                        <button
                          onClick={() => submitRequest(m._id)}
                          disabled={submitting}
                          className="btn-primary mt-2 text-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => submitRequest()} disabled={submitting} className="btn-secondary w-full">
                  Send to Any Available Mechanic
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
