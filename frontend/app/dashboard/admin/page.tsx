'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import {
  Users,
  Wrench,
  Activity,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Calendar,
  ChevronRight,
  TrendingDown,
  Info,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard/admin' },
  { label: 'Verify Partners', href: '/dashboard/admin/verify' },
  { label: 'Live Requests', href: '/dashboard/admin/requests' },
  { label: 'Users', href: '/dashboard/admin/users' },
];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<{ stats: Record<string, number>; recentRequests: ServiceRequest[] } | null>(null);
  const [loading, setLoading] = useState(true);

  // Date indicator
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.getAdminDashboard()
        .then(setData)
        .catch((err) => console.error('Error fetching admin data:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  const stats = data?.stats;

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
        
        {/* 1. WELCOME HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-100 p-6 rounded-3xl shadow-sm gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight">System Control Center</h2>
            <p className="text-xs sm:text-sm text-slate-450 font-semibold mt-1">Monitor roadside operations, verify mechanics, and manage users.</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-550 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
              <Calendar className="w-4 h-4 text-[#FF6B00]" />
              <span>{formattedDate}</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              API Services Active
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : stats ? (
          <>
            {/* 2. STATS OVERVIEW CARD GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total System Users</span>
                  <Users className="w-4.5 h-4.5 text-blue-500" />
                </div>
                <p className="text-3xl font-black text-slate-900 leading-tight">{stats.totalUsers}</p>
                <span className="text-[10px] text-slate-450 font-bold block mt-2">Drivers, operators, and admins</span>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Partners</span>
                  <Wrench className="w-4.5 h-4.5 text-orange-500" />
                </div>
                <p className="text-3xl font-black text-slate-900 leading-tight">{stats.totalMechanics}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-2">✓ Active mechanic terminals</span>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Requests</span>
                  <Activity className="w-4.5 h-4.5 text-yellow-500 animate-pulse" />
                </div>
                <p className="text-3xl font-black text-slate-900 leading-tight">{stats.activeRequests}</p>
                <span className="text-[10px] text-slate-455 font-bold block mt-2">Pending or in-progress now</span>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Services</span>
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <p className="text-3xl font-black text-slate-900 leading-tight">{stats.completedRequests}</p>
                <span className="text-[10px] text-slate-450 font-bold block mt-2">Total resolved rescue jobs</span>
              </div>
            </div>

            {/* 3. PERFORMANCE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Platform Rating</span>
                  <Star className="w-4.5 h-4.5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.avgRating} / 5</p>
                <p className="text-[10px] text-slate-450 font-bold mt-1">Aggregated customer feedback rating</p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dispatch Acceptance Rate</span>
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.acceptanceRate}%</p>
                <p className="text-[10px] text-slate-450 font-bold mt-1">Average mechanic claim rate limits</p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Verifications</span>
                  <Wrench className="w-4.5 h-4.5 text-[#FF6B00]" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stats.pendingMechanics}</p>
                <p className="text-[10px] text-slate-450 font-bold mt-1">Partner applications waiting approval</p>
              </div>
            </div>

            {/* 4. RECENT ACTIVITIES TABLE LIST */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B132B] tracking-tight">Recent Service Requests</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Real-time rescue request timeline logs</p>
                </div>
                <Link
                  href="/dashboard/admin/requests"
                  className="text-xs font-bold text-[#FF6B00] hover:underline"
                >
                  View All Live Requests
                </Link>
              </div>

              <div className="space-y-4">
                {data?.recentRequests.map((req) => {
                  const userName = typeof req.userId === 'object' ? req.userId.name : 'Unknown';
                  const mechanicName = typeof req.mechanicId === 'object' ? req.mechanicId?.name : 'Unassigned';
                  return (
                    <div
                      key={req._id}
                      className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 hover:border-[#FF6B00]/40 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider block">
                            {SERVICE_LABELS[req.serviceType]}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">#RVA-{req._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight mt-1.5">
                          {userName} <span className="text-slate-400 font-semibold mx-1">➔</span> {mechanicName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(req.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3.5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 justify-between">
                        <StatusBadge status={req.status} />
                        <Link
                          href="/dashboard/admin/requests"
                          className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#FF6B00] transition"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">Failed to fetch admin stats payload.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
