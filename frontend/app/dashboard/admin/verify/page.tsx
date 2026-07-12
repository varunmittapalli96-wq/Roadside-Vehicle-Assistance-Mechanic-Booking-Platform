'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner, StatusBadge } from '@/components/ui';
import { api, User } from '@/lib/api';
import {
  CheckCircle,
  XCircle,
  Shield,
  Phone,
  Mail,
  FileText,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/admin' },
  { label: 'Verify Partners', href: '/dashboard/admin/verify' },
  { label: 'Live Requests', href: '/dashboard/admin/requests' },
  { label: 'Users', href: '/dashboard/admin/users' },
];

export default function VerifyPartnersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mechanics, setMechanics] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/login');
  }, [user, authLoading, router]);

  const load = () => api.getPendingMechanics().then(setMechanics).finally(() => setLoading(false));

  useEffect(() => {
    if (user?.role === 'admin') load();
  }, [user]);

  const verify = async (id: string) => {
    setActionId(id);
    try {
      await api.verifyMechanic(id);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id: string) => {
    if (!confirm('Reject this partner application? This will permanently delete/reject their details.')) return;
    setActionId(id);
    try {
      await api.rejectMechanic(id);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="Verify Partners">
      <div className="space-y-8 animate-fadeIn max-w-[1000px] mx-auto">
        
        {/* Page Header */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-black text-[#0B132B] tracking-tight">Verify System Partners</h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            Audit business registration licenses, expertise bios, and credentials before approving active terminals.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : mechanics.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800">All caught up!</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-2">
              No pending partner verifications are in queue. All service terminals are verified.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {mechanics.map((m) => (
              <div
                key={m._id}
                className="bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 shadow-sm hover:border-[#FF6B00]/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Mechanic application info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                      <Shield className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-2.5 min-w-0">
                      <div>
                        <h4 className="text-base font-black text-slate-900 leading-tight">
                          {m.profile?.businessName || m.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">
                          Technician: {m.name}
                        </span>
                      </div>
                      
                      {/* Contacts */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {m.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {m.phone}</span>
                        <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-slate-400" /> License: {m.profile?.licenseNumber}</span>
                      </div>

                      {m.profile?.bio && (
                        <p className="text-xs text-slate-450 leading-relaxed font-semibold bg-slate-50/60 p-3.5 rounded-xl border border-slate-100/50">
                          {m.profile.bio}
                        </p>
                      )}

                      {/* Services list */}
                      {m.profile?.services && m.profile.services.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {m.profile.services.map((s) => (
                            <span
                              key={s}
                              className="bg-orange-500/5 text-[#FF6B00] text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-orange-500/10"
                            >
                              {s.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 justify-end w-full lg:w-auto flex-shrink-0">
                    <button
                      onClick={() => verify(m._id)}
                      disabled={actionId === m._id}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold h-11 px-4.5 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Partner
                    </button>
                    <button
                      onClick={() => reject(m._id)}
                      disabled={actionId === m._id}
                      className="bg-red-650 hover:bg-red-700 text-white font-extrabold h-11 px-4.5 rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
