'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import { Users, Wrench, Activity, CheckCircle, Star, TrendingUp } from 'lucide-react';

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

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.getAdminDashboard().then(setData).finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  const stats = data?.stats;

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      {loading ? (
        <LoadingSpinner />
      ) : stats ? (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600' },
              { label: 'Verified Partners', value: stats.totalMechanics, icon: Wrench, color: 'text-orange-600' },
              { label: 'Active Requests', value: stats.activeRequests, icon: Activity, color: 'text-yellow-600' },
              { label: 'Completed Services', value: stats.completedRequests, icon: CheckCircle, color: 'text-green-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card">
                <Icon className={`w-8 h-8 ${color} mb-2`} />
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card">
              <Star className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-sm text-gray-500">Avg. User Rating</p>
              <p className="text-2xl font-bold">{stats.avgRating} / 5</p>
            </div>
            <div className="card">
              <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-500">Partner Acceptance Rate</p>
              <p className="text-2xl font-bold">{stats.acceptanceRate}%</p>
            </div>
            <div className="card">
              <Wrench className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm text-gray-500">Pending Verifications</p>
              <p className="text-2xl font-bold">{stats.pendingMechanics}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Recent Service Requests</h3>
            <div className="space-y-3">
              {data?.recentRequests.map((req) => {
                const userName = typeof req.userId === 'object' ? req.userId.name : 'Unknown';
                const mechanicName = typeof req.mechanicId === 'object' ? req.mechanicId?.name : 'Unassigned';
                return (
                  <div key={req._id} className="card flex items-center justify-between">
                    <div>
                      <p className="font-medium">{SERVICE_LABELS[req.serviceType]}</p>
                      <p className="text-sm text-gray-500">{userName} → {mechanicName}</p>
                      <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
