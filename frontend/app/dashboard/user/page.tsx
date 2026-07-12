'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, Vehicle, SERVICE_LABELS } from '@/lib/api';
import {
  AlertCircle,
  Car,
  Plus,
  History,
  MapPin,
  Calendar,
  Compass,
  IndianRupee,
  Users,
  CheckCircle2,
  Zap,
  Award,
  Truck,
  Wrench,
  Battery,
  Fuel,
  Lock,
  Download,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Real dynamic states
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Action Array
  const quickActions = [
    { label: 'Request Tow Truck', icon: Truck, serviceType: 'towing' },
    { label: 'Flat Tire Repair', icon: CircleIcon, serviceType: 'flat_tire' },
    { label: 'Battery Jump Start', icon: Battery, serviceType: 'battery_jump' },
    { label: 'Fuel Delivery', icon: Fuel, serviceType: 'fuel_delivery' },
    { label: 'Lockout Assist', icon: Lock, serviceType: 'lockout' },
    { label: 'Engine Diagnosis', icon: Wrench, serviceType: 'breakdown' },
  ];

  // Date formatter helper
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'user') {
      setLoading(true);
      Promise.all([api.getRequests(), api.getVehicles()])
        .then(([requestsData, vehiclesData]) => {
          setRequests(requestsData);
          setVehicles(vehiclesData);
        })
        .catch((err) => console.error('Error fetching dashboard data:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return <LoadingSpinner />;

  const active = requests.filter((r) =>
    ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'].includes(r.status)
  );
  const completed = requests.filter((r) => r.status === 'completed');

  // Calculate total spent from real completed requests
  const totalSpent = completed.reduce((sum, r) => sum + (r.finalPrice || r.estimatedPrice || 0), 0);

  return (
    <DashboardLayout navItems={navItems} title="Overview">
      <div className="space-y-8 animate-fadeIn">
        
        {/* 1. WELCOME HEADER CONTAINER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-100 p-6 rounded-3xl shadow-sm gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight">
              Good Morning, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">Ready to drive safely today?</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-500">
              <Calendar className="w-4 h-4 text-[#FF6B00]" />
              <span>{formattedDate}</span>
            </div>
            {user.location?.address && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-500">
                <MapPin className="w-4 h-4 text-[#FF6B00]" />
                <span>{user.location.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. HERO DISPATCH CARD */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-white text-white" /> Emergency Response Active
              </div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">Need roadside assistance?</h3>
              <p className="text-sm text-orange-50 font-semibold leading-relaxed">
                Connect instantly with certified mechanics. Watch estimated dispatch arrivals and location maps in real-time.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard/user/request"
                  className="bg-white hover:bg-orange-50 text-[#FF6B00] font-black h-12 px-6 rounded-xl flex items-center gap-1.5 text-sm transition shadow shadow-orange-500/10 hover:-translate-y-0.5"
                >
                  <Plus className="w-4.5 h-4.5" /> Request Emergency Help
                </Link>
                {active.length > 0 && (
                  <Link
                    href={`/dashboard/user/track/${active[0]._id}`}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold h-12 px-6 rounded-xl flex items-center gap-1.5 text-sm transition border border-white/20 hover:-translate-y-0.5"
                  >
                    <Compass className="w-4.5 h-4.5 animate-spin" /> Track Current Request
                  </Link>
                )}
              </div>
            </div>
            
            {active.length > 0 && active[0].estimatedArrivalMinutes ? (
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full lg:max-w-xs shadow-inner">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-100 block mb-3">Live Dispatch ETA</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white text-[#FF6B00] rounded-xl flex items-center justify-center font-black text-lg">
                    {active[0].estimatedArrivalMinutes}
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-none text-white">Minutes Estimated Arrival</span>
                    <span className="text-[9px] text-orange-200 mt-1 block">Track technician location live</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* 3. QUICK ACTIONS GRID */}
        <div>
          <h3 className="text-base font-black text-[#0B132B] uppercase tracking-widest mb-4 pl-1">Quick Assist Dispatch</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={`/dashboard/user/request?type=${action.serviceType}`}
                  className="group bg-white border border-slate-100 hover:border-[#FF6B00]/40 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-11 h-11 bg-slate-50 group-hover:bg-[#FF6B00]/5 text-[#FF6B00] border border-slate-150 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-all">
                    <Icon className="w-5.5 h-5.5 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-extrabold text-[#0B132B] tracking-tight">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 4. STATISTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Requests</span>
              {active.length > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">{active.length}</p>
            <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time status updates</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Services</span>
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">{completed.length}</p>
            <div className="text-[10px] text-slate-400 font-bold mt-2">All invoice receipts available</div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount Spent</span>
              <IndianRupee className="w-4.5 h-4.5 text-[#FF6B00]" />
            </div>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">₹{totalSpent}</p>
            <div className="text-[10px] text-slate-400 font-bold mt-2">Aggregated ledger sum</div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Cars</span>
              <Car className="w-4.5 h-4.5 text-[#FF6B00]" />
            </div>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">{vehicles.length}</p>
            <div className="text-[10px] text-slate-400 font-bold mt-2">Active profiles for support</div>
          </div>
        </div>

        {/* 5. MAIN DETAILS: Active Trackings / Recent Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active / Map Dispatch Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B132B] tracking-tight">Live Dispatch tracking</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Real-time status updates</p>
                </div>
                {active.length > 0 ? (
                  <span className="bg-orange-50 border border-orange-100 text-[#FF6B00] font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                    Track Active
                  </span>
                ) : (
                  <span className="bg-slate-50 border border-slate-100 text-slate-400 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                    No active dispatches
                  </span>
                )}
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : active.length > 0 ? (
                <div className="space-y-4">
                  {active.map((req) => (
                    <Link
                      key={req._id}
                      href={`/dashboard/user/track/${req._id}`}
                      className="border border-slate-150 rounded-2xl p-5 hover:border-[#FF6B00]/40 transition-colors block group bg-slate-50/20"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider block mb-1">
                            {SERVICE_LABELS[req.serviceType]}
                          </span>
                          <h4 className="text-base font-bold text-slate-800 leading-tight">{req.location.address}</h4>
                          {req.estimatedArrivalMinutes && req.status !== 'pending' && (
                            <p className="text-xs text-slate-400 font-bold mt-2 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                              Estimated Arrival: {req.estimatedArrivalMinutes} min
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3.5">
                          <StatusBadge status={req.status} />
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                  <Car className="w-12 h-12 text-slate-300 mb-3" />
                  <h4 className="text-sm font-black text-slate-800">No active request dispatches</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1 mb-5">Your vehicle is safe and sound.</p>
                  <Link
                    href="/dashboard/user/request"
                    className="inline-flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold h-10 px-5 rounded-xl text-xs transition"
                  >
                    <Plus className="w-4 h-4" /> Request Help
                  </Link>
                </div>
              )}
            </div>

            {/* Registered Vehicles Panel */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B132B] tracking-tight">My Registered Vehicles</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Insurance & diagnostics status dashboard</p>
                </div>
                <Link
                  href="/dashboard/user/vehicles"
                  className="text-xs font-bold text-[#FF6B00] hover:underline"
                >
                  Manage Cars
                </Link>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : vehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicles.map((v) => (
                    <div key={v._id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30">
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-10 h-10 bg-slate-100 text-[#0B132B] rounded-xl flex items-center justify-center">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">{v.make} {v.model}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{v.licensePlate}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 border-t border-slate-100/60 pt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <div>Model Year: <span className="text-slate-800">{v.year}</span></div>
                        <div>Fuel: <span className="text-slate-800">{v.fuelType}</span></div>
                        {v.color && <div>Color: <span className="text-slate-800">{v.color}</span></div>}
                        <div>Status: <span className="text-emerald-650">Registered</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                  <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold mb-3">No registered vehicles found.</p>
                  <Link
                    href="/dashboard/user/vehicles"
                    className="inline-flex items-center gap-1.5 bg-[#FF6B00] text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Add Vehicle
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Widgets (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Account Verification Details Card */}
            <div className="bg-gradient-to-br from-[#0B132B] to-[#1E293B] border border-slate-800 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/10 rounded-full blur-2xl" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest block mb-1">RVA Pro Portal</span>
                  <h4 className="text-xl font-black tracking-tight">Security Center</h4>
                </div>
                <Award className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex justify-between font-bold">
                  <span>Authentication Status</span>
                  <span className="text-emerald-400">Secure</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Profile Verification</span>
                  <span className={user.isVerified ? 'text-emerald-450' : 'text-amber-400'}>
                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/user/profile"
                className="w-full h-11 bg-white hover:bg-slate-50 text-[#0B132B] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                View Account Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Recent Completed Activities list */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-base font-black text-[#0B132B] tracking-tight">Recent Activity</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Your payment logs history</p>
                </div>
                <Link href="/dashboard/user/history" className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-0.5">
                  <History className="w-3.5 h-3.5" /> View all
                </Link>
              </div>

              {completed.length > 0 ? (
                <div className="space-y-4">
                  {completed.slice(0, 3).map((req) => (
                    <div key={req._id} className="flex items-start justify-between text-xs gap-3">
                      <div>
                        <p className="font-bold text-slate-800">{SERVICE_LABELS[req.serviceType]}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {new Date(req.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="font-extrabold text-[#0B132B]">₹{req.finalPrice || req.estimatedPrice}</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 font-bold">Paid</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-semibold text-center py-6">No recent completed services logs.</p>
              )}
            </div>

            {/* Quick Live Support box */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h4 className="text-sm font-black text-[#0B132B] uppercase tracking-widest mb-3 pl-0.5">Direct Assistance Help</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-4">
                Have trouble or queries about an invoice? Chat with an advisor.
              </p>
              <button className="w-full h-11 border border-slate-200 hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 text-[#0B132B] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                Chat With Agent Now
              </button>
            </div>

          </div>

        </div>

        {/* 6. DETAILED SERVICE HISTORY LOGS DATA TABLE */}
        {completed.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 mb-6 gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0B132B] tracking-tight">Service Records & Invoice Logs</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Full historical ledger matching verified support partners</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm">
                  <Download className="w-4 h-4 text-slate-500" /> Export CSV
                </button>
                <button className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm">
                  <FileText className="w-4 h-4 text-slate-500" /> Export PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9px]">
                    <th className="py-3 px-4 pl-1">Request ID</th>
                    <th className="py-3 px-4">Service Type</th>
                    <th className="py-3 px-4">Date Completed</th>
                    <th className="py-3 px-4">GPS Destination Location</th>
                    <th className="py-3 px-4">Charge Amount</th>
                    <th className="py-3 px-4 text-right pr-1">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {completed.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4.5 px-4 pl-1 font-bold text-slate-900">#RVA-{req._id.slice(-6).toUpperCase()}</td>
                      <td className="py-4.5 px-4 font-bold text-[#FF6B00]">{SERVICE_LABELS[req.serviceType]}</td>
                      <td className="py-4.5 px-4 text-slate-450">{new Date(req.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="py-4.5 px-4 max-w-xs truncate text-slate-500">{req.location.address}</td>
                      <td className="py-4.5 px-4 font-black text-slate-900">₹{req.finalPrice || req.estimatedPrice}</td>
                      <td className="py-4.5 px-4 text-right pr-1">
                        <Link
                          href={`/dashboard/user/history`}
                          className="text-[#FF6B00] hover:underline font-bold text-[11px]"
                        >
                          Invoice Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

// Mini helper components
function CircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
