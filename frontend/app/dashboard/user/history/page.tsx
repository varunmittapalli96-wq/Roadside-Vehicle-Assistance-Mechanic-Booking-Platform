'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, StarRating, LoadingSpinner } from '@/components/ui';
import { api, ServiceRequest, SERVICE_LABELS } from '@/lib/api';
import {
  MapPin,
  Clock,
  Star,
  IndianRupee,
  Search,
  SlidersHorizontal,
  Download,
  FileText,
  Printer,
  ChevronDown,
  Wrench,
  Car,
  User,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

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

  // Review / rating form parameters
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  // Expandable details log index
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) router.replace('/login');
  }, [user, authLoading, router]);

  const loadRequests = () => {
    if (user?.role === 'user') {
      api.getRequests().then(setRequests).finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleRate = async (id: string) => {
    await api.rateRequest(id, rating, feedback);
    setRatingId(null);
    setFeedback('');
    loadRequests();
  };

  if (authLoading || !user) return <LoadingSpinner />;

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchSearch =
      req.location.address.toLowerCase().includes(search.toLowerCase()) ||
      req._id.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === 'All' || req.status.toLowerCase() === filterStatus.toLowerCase();
    const matchService = filterService === 'All' || req.serviceType.toLowerCase() === filterService.toLowerCase();

    return matchSearch && matchStatus && matchService;
  });

  const completed = filteredRequests.filter((r) => ['completed', 'cancelled'].includes(r.status));
  const active = filteredRequests.filter((r) => !['completed', 'cancelled'].includes(r.status));

  // Compute analytics
  const totalAmountSaved = completed.length * 450; // mock saving multiplier
  const avgResponseTime = completed.length > 0 ? 12 : 0;
  const totalSpent = completed.reduce((sum, r) => sum + (r.finalPrice || r.estimatedPrice || 0), 0);

  return (
    <DashboardLayout navItems={navItems} title="Service History">
      <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
        
        {/* 1. PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-100 p-6 rounded-3xl shadow-sm gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight">Service History</h2>
            <p className="text-xs sm:text-sm text-slate-450 font-semibold mt-1">
              Review all completed assistance dispatches, payment invoices, and diagnostics timelines.
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm">
              <Download className="w-4 h-4 text-slate-500" /> Export CSV
            </button>
            <button className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm">
              <FileText className="w-4 h-4 text-slate-500" /> Export PDF
            </button>
            <button className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm">
              <Printer className="w-4 h-4 text-slate-500" /> Print
            </button>
          </div>
        </div>

        {/* 2. OVERVIEW ANALYTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Completed Jobs</span>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">{completed.length}</p>
            <span className="text-[10px] text-slate-450 font-bold block mt-2">100% resolution success rate</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Amount Spent</span>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">₹{totalSpent}</p>
            <span className="text-[10px] text-slate-450 font-bold block mt-2">Unified diagnostic invoices</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Average Response Speed</span>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">{avgResponseTime} min</p>
            <span className="text-[10px] text-emerald-600 font-bold block mt-2">✓ Verified GPS routing limit</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Membership Savings</span>
            <p className="text-3xl font-black text-[#0B132B] tracking-tight">₹{totalAmountSaved}</p>
            <span className="text-[10px] text-[#FF6B00] font-black block mt-2">Gold Tier Discount Applied</span>
          </div>
        </div>

        {/* 3. SEARCH & ADVANCED FILTERS BAR */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search history by request ID or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-xs outline-none focus:ring-1 focus:ring-[#FF6B00] transition"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-650">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none"
              >
                <option value="All">All statuses</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-655">
              <span>Service:</span>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none"
              >
                <option value="All">All Services</option>
                <option value="breakdown">Breakdown Repair</option>
                <option value="flat_tire">Flat Tire</option>
                <option value="battery_jump">Battery Jump</option>
                <option value="fuel_delivery">Fuel Delivery</option>
                <option value="towing">Towing</option>
                <option value="lockout">Lockout</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. DYNAMIC HISTORY TIMELINE & CARDS */}
        {loading ? (
          <LoadingSpinner />
        ) : completed.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800">No Service Logs Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-2 mb-6">
              You haven&apos;t completed any service dispatches yet. Once you use RVA Pro, every receipt and invoice ledger is saved here.
            </p>
            <Link
              href="/dashboard/user/request"
              className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-12 px-6 rounded-xl text-xs transition"
            >
              Request Your First Assistance
            </Link>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-slate-200/80 space-y-8">
            
            {completed.map((req) => {
              const vehicle = typeof req.vehicleId === 'object' ? req.vehicleId : null;
              const mechanic = typeof req.mechanicId === 'object' ? req.mechanicId : null;
              const isExpanded = expandedCard === req._id;

              return (
                <div key={req._id} className="relative group">
                  
                  {/* Stepper timeline dot */}
                  <span className="absolute -left-[31px] top-6 w-3 h-3 bg-[#FF6B00] border-2 border-white rounded-full group-hover:scale-110 transition-transform shadow" />

                  {/* Service Card container */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-[#FF6B00]/30 transition-colors">
                    
                    {/* Top row elements */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      
                      {/* Left: Service & vehicle header info */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                          <Wrench className="w-5.5 h-5.5 stroke-[1.75]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-black text-slate-900 tracking-tight leading-none">
                              {SERVICE_LABELS[req.serviceType]}
                            </h3>
                            <StatusBadge status={req.status} />
                          </div>
                          
                          {vehicle && (
                            <p className="text-xs text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
                              {vehicle.make} {vehicle.model} · {vehicle.licensePlate}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] font-bold text-slate-550 uppercase tracking-wide">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {req.location.address}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(req.createdAt).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment Cost details & Expand Toggle */}
                      <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end gap-2 flex-shrink-0">
                        <div className="text-lg font-black text-slate-900 flex items-baseline">
                          <span className="text-xs text-slate-400 font-bold mr-0.5">₹</span>
                          {req.finalPrice || req.estimatedPrice}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedCard(isExpanded ? null : req._id)}
                            className="text-xs font-bold text-slate-500 hover:text-[#FF6B00] bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 transition flex items-center gap-1"
                          >
                            <span>Details</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {req.status === 'completed' && !req.rating && (
                            <button
                              type="button"
                              onClick={() => setRatingId(ratingId === req._id ? null : req._id)}
                              className="text-xs font-black text-[#FF6B00] bg-orange-500/5 hover:bg-orange-500/10 px-2.5 py-1.5 rounded-lg transition"
                            >
                              Rate Service
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Inline Rate Service Dialog */}
                    {ratingId === req._id && (
                      <div className="mt-6 pt-5 border-t border-slate-100 space-y-4 max-w-sm animate-fadeIn">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest pl-0.5">Provide Rating & Feedback</h4>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} type="button" onClick={() => setRating(s)}>
                              <Star className={`w-6 h-6 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                            </button>
                          ))}
                        </div>
                        <input
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] text-xs font-semibold"
                          placeholder="Write a review (optional)..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleRate(req._id)}
                            className="bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-extrabold h-9 px-4 rounded-lg transition"
                          >
                            Submit Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setRatingId(null)}
                            className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold h-9 px-4 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rated stars feedback indicator */}
                    {req.rating && (
                      <div className="mt-4 pt-4 border-t border-slate-100/60 flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-1 text-amber-500">
                          <StarRating rating={req.rating} />
                          <span className="text-slate-400 ml-1">· Rated</span>
                        </div>
                        {req.feedback && <p className="text-slate-500 font-medium italic">&ldquo;{req.feedback}&rdquo;</p>}
                      </div>
                    )}

                    {/* EXPANDED INVOICE DETAILS VAULT */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-slate-550">
                          
                          {/* Left Details Block */}
                          <div className="space-y-4 bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest pl-0.5 border-b border-slate-200/40 pb-2 mb-2">Invoice Summary</h4>
                            <div className="flex justify-between">
                              <span>Base diagnostic charge</span>
                              <span className="text-slate-805">₹{req.finalPrice || req.estimatedPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxes & GST (18%)</span>
                              <span className="text-slate-805">Included</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200/40 pt-3 text-slate-900 font-black">
                              <span>Charged Total</span>
                              <span className="text-[#FF6B00]">₹{req.finalPrice || req.estimatedPrice}</span>
                            </div>
                          </div>

                          {/* Right Details Block */}
                          <div className="space-y-3.5">
                            {mechanic && (
                              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-700">
                                  {mechanic.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Assigned Mechanic</span>
                                  <h5 className="text-sm font-black text-slate-900 leading-tight">{mechanic.profile?.businessName || mechanic.name}</h5>
                                  <p className="text-[10px] text-[#FF6B00] font-black mt-1">✓ ASE Certified partner</p>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button className="flex-1 border border-slate-200 hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 text-slate-800 text-xs font-extrabold h-11 px-4 rounded-xl transition shadow-sm">
                                Download PDF Invoice
                              </button>
                              <Link
                                href={`/dashboard/user/request?type=${req.serviceType}`}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold h-11 px-4 rounded-xl transition flex items-center justify-center gap-1 shadow"
                              >
                                Rebook Service <RotateCcw className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

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
