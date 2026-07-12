'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner, EmptyState } from '@/components/ui';
import { api, User } from '@/lib/api';
import {
  User as UserIcon,
  Mail,
  Phone,
  Search,
  SlidersHorizontal,
  Shield,
  Info,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/admin' },
  { label: 'Verify Partners', href: '/dashboard/admin/verify' },
  { label: 'Live Requests', href: '/dashboard/admin/requests' },
  { label: 'Users', href: '/dashboard/admin/users' },
];

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.getAllUsers()
        .then(setUsers)
        .catch((err) => console.error('Error fetching users:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  // Filter users list
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);

    const matchRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();

    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout navItems={navItems} title="Registered Users">
      <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
        
        {/* Page Header */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-black text-[#0B132B] tracking-tight">System Users & Accounts</h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">
            Browse and manage all registered vehicle owners, verified mechanics, and administrative credentials.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search user profiles (e.g. name, email, phone)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-xs outline-none focus:ring-1 focus:ring-[#FF6B00] transition"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-650">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-[#FF6B00]"
              >
                <option value="All">All Roles</option>
                <option value="User">Vehicle Owners</option>
                <option value="Mechanic">Mechanics</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <UserIcon className="w-16 h-16 text-slate-350 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800">No Users Found</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">No user accounts matched the filtered criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:border-[#FF6B00]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100/60 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                        <UserIcon className="w-5.5 h-5.5 stroke-[1.5]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight">{u.name}</h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wider">Account ID: {u._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      {u.role === 'admin' ? (
                        <span className="bg-purple-50 text-purple-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-100">
                          Admin
                        </span>
                      ) : u.role === 'mechanic' ? (
                        <span className="bg-orange-50 text-[#FF6B00] text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-orange-100">
                          Mechanic
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-100">
                          Vehicle Owner
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-550 font-bold pl-0.5">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {u.email}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {u.phone}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100/60 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0.5">
                  <span>Status: <span className={u.isVerified ? 'text-emerald-650' : 'text-amber-500'}>{u.isVerified ? 'Verified' : 'Pending'}</span></span>
                  <span>Joined RVA</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
