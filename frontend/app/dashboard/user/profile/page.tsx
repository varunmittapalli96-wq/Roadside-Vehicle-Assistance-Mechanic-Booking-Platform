'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner } from '@/components/ui';
import { api } from '@/lib/api';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  Award,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

export default function UserProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form profile state details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) {
      router.replace('/login');
    } else if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.location?.address || '');
    }
  }, [user, authLoading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.updateProfile({
        name,
        phone,
        location: {
          coordinates: user?.location?.coordinates || [77.5946, 12.9716],
          address,
        },
      });
      setMessage('Profile settings updated successfully! Please reload to see topbar updates.');
      // Wait and reload window to sync AuthContext state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Account Profile">
      <div className="space-y-8 animate-fadeIn max-w-[800px] mx-auto">
        
        {/* Header Title */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-black text-[#0B132B] tracking-tight">Account Details</h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">Configure your login, verification parameters, and active GPS address.</p>
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main profile form (8 columns) */}
          <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <form onSubmit={handleUpdate} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] text-sm text-slate-900 font-semibold"
                    placeholder="Enter your name"
                  />
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">Email Address (Read-Only)</label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full h-12 pl-10 pr-4 border border-slate-200 rounded-xl outline-none bg-slate-50 text-sm text-slate-400 font-semibold cursor-not-allowed"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-350" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] text-sm text-slate-900 font-semibold"
                    placeholder="Enter phone number"
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">Primary Location Address</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] text-sm text-slate-900 font-semibold"
                    placeholder="e.g. Gurugram, Haryana"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-[50px] rounded-xl text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving updates...' : 'Save Profile Settings'}
              </button>

            </form>
          </div>

          {/* Right info details (4 columns) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Status card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white relative overflow-hidden">
              <span className="text-[9px] font-black text-[#FF6B00] uppercase tracking-widest block mb-1">Account Tier</span>
              <h3 className="text-lg font-black tracking-tight mb-4">Standard User</h3>
              
              <div className="space-y-3.5 text-[11px] font-bold text-slate-400">
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span className={user.isVerified ? 'text-emerald-400' : 'text-amber-400'}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Joined Date:</span>
                  <span className="text-white">Active Portal</span>
                </div>
              </div>
            </div>

            {/* Assistance statistics box */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h4 className="text-xs font-black text-[#0B132B] uppercase tracking-widest mb-3">Security Note</h4>
              <p className="text-xs text-slate-450 font-semibold leading-relaxed">
                Your email address and role cannot be changed manually. If you need a role change or address validation adjustments, please submit a request to support desk channels.
              </p>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
