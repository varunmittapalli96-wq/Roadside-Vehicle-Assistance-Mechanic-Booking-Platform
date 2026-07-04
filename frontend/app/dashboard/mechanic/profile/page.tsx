'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner } from '@/components/ui';
import { api, SERVICE_LABELS } from '@/lib/api';

const navItems = [
  { label: 'Overview', href: '/dashboard/mechanic' },
  { label: 'Incoming Requests', href: '/dashboard/mechanic/requests' },
  { label: 'My Jobs', href: '/dashboard/mechanic/jobs' },
  { label: 'Earnings', href: '/dashboard/mechanic/earnings' },
  { label: 'Profile', href: '/dashboard/mechanic/profile' },
];

const ALL_SERVICES = Object.keys(SERVICE_LABELS);

export default function MechanicProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    bio: '',
    experience: 0,
    services: [] as string[],
    isAvailable: true,
    pricing: {
      breakdownRepair: 500,
      towing: 800,
      batteryJumpStart: 300,
      flatTireRepair: 400,
      fuelDelivery: 350,
    },
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mechanic')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.profile) {
      setForm({
        businessName: user.profile.businessName || '',
        bio: user.profile.bio || '',
        experience: user.profile.experience || 0,
        services: user.profile.services || [],
        isAvailable: user.isAvailable ?? true,
        pricing: {
          breakdownRepair: user.profile.pricing?.breakdownRepair || 500,
          towing: user.profile.pricing?.towing || 800,
          batteryJumpStart: user.profile.pricing?.batteryJumpStart || 300,
          flatTireRepair: user.profile.pricing?.flatTireRepair || 400,
          fuelDelivery: user.profile.pricing?.fuelDelivery || 350,
        },
      });
    }
  }, [user]);

  const toggleService = (s: string) => {
    setForm({
      ...form,
      services: form.services.includes(s)
        ? form.services.filter((x) => x !== s)
        : [...form.services, s],
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.updateMechanicProfile(form);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          await api.updateMechanicLocation([
            pos.coords.longitude,
            pos.coords.latitude,
          ]);
        });
      }
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Profile & Settings">
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="card space-y-4">
          <h3 className="font-semibold">Business Information</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input className="input-field" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea className="input-field" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience (years)</label>
            <input type="number" className="input-field" value={form.experience} onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) })} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="rounded" />
            <span className="text-sm font-medium">Available for new jobs</span>
          </label>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold">Services Offered</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {ALL_SERVICES.map((s) => (
              <label key={s} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleService(s)} className="rounded" />
                <span className="text-sm">{SERVICE_LABELS[s]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold">Pricing (₹)</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(form.pricing).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="number"
                  className="input-field"
                  value={value}
                  onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, [key]: parseInt(e.target.value) } })}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </DashboardLayout>
  );
}
