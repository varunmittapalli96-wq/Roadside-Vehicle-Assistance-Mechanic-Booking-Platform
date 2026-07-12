'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { StarRating, LoadingSpinner } from '@/components/ui';
import { api, Vehicle, NearbyMechanic, SERVICE_LABELS } from '@/lib/api';
import {
  MapPin,
  Navigation,
  Compass,
  Star,
  Clock,
  Wrench,
  Car,
  AlertTriangle,
  AlertCircle,
  Flame,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Sparkles,
  Paperclip,
  Upload,
  User,
  Shield,
  HelpCircle,
  Truck,
  Battery,
  Fuel,
  Lock,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

export default function RequestHelpPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultServiceType = searchParams.get('type') || '';

  // Step Workflow: 1 = Service & Vehicle, 2 = Confirm Location & Issue, 3 = Loading Scan, 4 = Select Mechanic / Success
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mechanics, setMechanics] = useState<NearbyMechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lng: number; lat: number; address: string } | null>(null);

  // Form parameters
  const [form, setForm] = useState({
    vehicleId: '',
    serviceType: defaultServiceType,
    description: '',
    urgency: 'normal', // 'normal' | 'urgent' | 'emergency'
    mechanicId: '',
  });

  // OTP Mobile / Location Mock Trigger
  const [scanningTime, setScanningTime] = useState(0);

  // Service Details Data
  const services = [
    { id: 'breakdown', title: 'Breakdown Repair', desc: 'On-site diagnostics and repair.', eta: '12 min', price: '₹399', icon: Wrench, popular: false },
    { id: 'flat_tire', title: 'Flat Tire Repair', desc: 'Tire change using spare wheel.', eta: '8 min', price: '₹299', icon: CircleIcon, popular: true },
    { id: 'battery_jump', title: 'Battery Jump Start', desc: 'Jump start or battery replace.', eta: '7 min', price: '₹199', icon: Battery, popular: false },
    { id: 'fuel_delivery', title: 'Fuel Delivery', desc: '5L emergency fuel dispatch.', eta: '10 min', price: '₹149', icon: Fuel, popular: false },
    { id: 'towing', title: 'Vehicle Towing', desc: 'Secure tow to local garage.', eta: '15 min', price: '₹699', icon: Truck, popular: false },
    { id: 'lockout', title: 'Lockout Assist', desc: 'Secure vehicle unlocking.', eta: '9 min', price: '₹249', icon: Lock, popular: false },
  ];

  // Detect GPS coordinates
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            address: `Latitude: ${pos.coords.latitude.toFixed(4)}, Longitude: ${pos.coords.longitude.toFixed(4)}`,
          });
        },
        () => {
          setLocation({ lng: 77.5946, lat: 12.9716, address: 'MG Road Metro Station, Bangalore' });
        }
      );
    } else {
      setLocation({ lng: 77.5946, lat: 12.9716, address: 'MG Road Metro Station, Bangalore' });
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) router.replace('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'user') {
      api.getVehicles().then((data) => {
        setVehicles(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, vehicleId: data[0]._id }));
        }
      }).finally(() => setLoading(false));
    }
  }, [user]);

  const startScanning = async () => {
    if (!location || !form.serviceType) return;
    setStep(3);
    
    // Simulate searching mechanics
    let count = 0;
    const interval = setInterval(async () => {
      count++;
      setScanningTime(count);
      if (count >= 3) {
        clearInterval(interval);
        try {
          const nearby = await api.getNearbyMechanics(location.lng, location.lat, form.serviceType);
          setMechanics(nearby);
          setStep(4);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to query mechanics');
          setStep(2);
        }
      }
    }, 1000);
  };

  const submitRequest = async (mechanicId?: string) => {
    if (!location) return;
    setSubmitting(true);
    setError('');
    try {
      const req = await api.createRequest({
        vehicleId: form.vehicleId,
        serviceType: form.serviceType,
        description: `${form.description} [Urgency: ${form.urgency.toUpperCase()}]`,
        location: { type: 'Point', coordinates: [location.lng, location.lat], address: location.address },
        mechanicId: mechanicId || form.mechanicId || undefined,
      });
      router.push(`/dashboard/user/track/${req._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) return <LoadingSpinner />;

  // Calculate prices based on service details
  const selectedService = services.find((s) => s.id === form.serviceType);
  const baseCharge = selectedService ? parseInt(selectedService.price.replace('₹', '')) : 0;
  const serviceFee = form.urgency === 'emergency' ? 150 : form.urgency === 'urgent' ? 80 : 0;
  const taxes = Math.round((baseCharge + serviceFee) * 0.18);
  const totalCost = baseCharge + serviceFee + taxes;

  return (
    <DashboardLayout navItems={navItems} title="Request Assistance">
      <div className="space-y-8 animate-fadeIn max-w-[1200px] mx-auto">
        
        {/* 1. STEPPER PROGRESS HEADER */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-6 flex-1 max-w-xl">
            {[
              { idx: 1, label: 'Choose Service' },
              { idx: 2, label: 'Configure details' },
              { idx: 3, label: 'Live scanning' },
              { idx: 4, label: 'Book responder' },
            ].map((s) => (
              <div key={s.idx} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.idx
                    ? 'bg-[#FF6B00] text-white ring-4 ring-orange-500/10'
                    : step > s.idx
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {s.idx}
                </div>
                {!collapsedWidth(s.idx) && (
                  <span className={`text-xs font-bold hidden md:inline ${step === s.idx ? 'text-[#0B132B]' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                )}
                {s.idx < 4 && (
                  <div className={`flex-1 h-0.5 rounded ${step > s.idx ? 'bg-emerald-500' : 'bg-slate-150'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-widest">Technicians Online:</span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              156 Active
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/60 border border-red-100/50 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold animate-fadeIn">
            {error}
          </div>
        )}

        {/* 2. MAIN LAYOUT GRID (Two columns on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT WORKFLOW COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: SELECT SERVICE & VEHICLE */}
            {step === 1 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B132B] tracking-tight">Select Assistance Type</h3>
                  <p className="text-xs text-slate-450 font-semibold mt-1">Specify your vehicle breakdown service request</p>
                </div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((s) => {
                    const Icon = s.icon;
                    const isSelected = form.serviceType === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setForm({ ...form, serviceType: s.id })}
                        className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 relative group flex flex-col justify-between h-[150px] ${
                          isSelected
                            ? 'border-[#FF6B00] bg-orange-500/[0.02] shadow-sm'
                            : 'border-slate-150 hover:border-[#FF6B00]/40 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                            isSelected ? 'bg-[#FF6B00] text-white' : 'bg-slate-50 text-slate-500'
                          }`}>
                            <Icon className="w-5.5 h-5.5 stroke-[1.75]" />
                          </div>
                          {s.popular && (
                            <span className="bg-[#FF6B00]/10 text-[#FF6B00] font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
                              Most Requested
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm tracking-tight">{s.title}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-[#FF6B00]" /> {s.eta}</span>
                            <span>·</span>
                            <span className="text-[#FF6B00]">{s.price} onwards</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Vehicle Selector */}
                <div>
                  <div className="flex items-center justify-between mb-3.5 pl-0.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Vehicle</label>
                    <Link
                      href="/dashboard/user/vehicles"
                      className="text-xs font-bold text-[#FF6B00] hover:underline"
                    >
                      + Add New Vehicle
                    </Link>
                  </div>

                  {vehicles.length === 0 ? (
                    <div className="p-5 border border-dashed border-slate-150 rounded-2xl text-center">
                      <Car className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-400 mb-1">No registered vehicle profiles found</p>
                      <Link href="/dashboard/user/vehicles" className="text-xs text-[#FF6B00] hover:underline font-black">
                        Configure vehicles list
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vehicles.map((v) => {
                        const isSel = form.vehicleId === v._id;
                        return (
                          <button
                            key={v._id}
                            type="button"
                            onClick={() => setForm({ ...form, vehicleId: v._id })}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              isSel
                                ? 'border-[#FF6B00] bg-orange-500/[0.01]'
                                : 'border-slate-150 bg-white hover:border-slate-250'
                            }`}
                          >
                            <span className="text-xs font-black text-slate-900 block leading-tight">{v.make} {v.model}</span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">{v.licensePlate}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Continue button Step 1 */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.serviceType || !form.vehicleId}
                  className="w-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-[54px] rounded-2xl text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/10"
                >
                  Confirm Service & Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: GPS MAP CONFIRMATION & ISSUE WRITTEN DETAILS */}
            {step === 2 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B132B] tracking-tight">Breakdown Details & Location</h3>
                  <p className="text-xs text-slate-450 font-semibold mt-1">Refine geo coordinates and describe symptoms</p>
                </div>

                {/* Geolocation indicator details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5.5 h-5.5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest pl-0.5">GPS Destination Coordinate</h4>
                      <p className="text-sm font-bold text-slate-700 mt-1 leading-normal">
                        {location?.address || 'Detecting satellite positioning...'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="w-full bg-white hover:bg-slate-50 text-[#0B132B] border border-slate-200 h-11 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Navigation className="w-4 h-4 text-[#FF6B00]" /> Recalibrate Location Coordinates
                  </button>
                </div>

                {/* Urgency Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">Assistance Urgency Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'normal', label: 'Normal Route', color: 'border-slate-200 text-slate-650 bg-slate-50/50', active: 'border-[#FF6B00] text-[#FF6B00] bg-orange-50/10' },
                      { id: 'urgent', label: 'Urgent Help', color: 'border-slate-200 text-slate-650 bg-slate-50/50', active: 'border-amber-500 text-amber-600 bg-amber-50/5' },
                      { id: 'emergency', label: 'Critical Emergency', color: 'border-slate-200 text-slate-650 bg-slate-50/50', active: 'border-red-500 text-red-600 bg-red-50/5' },
                    ].map((urg) => {
                      const isSel = form.urgency === urg.id;
                      return (
                        <button
                          key={urg.id}
                          type="button"
                          onClick={() => setForm({ ...form, urgency: urg.id })}
                          className={`py-3.5 border rounded-xl text-xs font-black transition-all ${
                            isSel ? urg.active : urg.color
                          }`}
                        >
                          {urg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text description */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-0.5">Describe your issue (Optional)</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Provide details for the responder (e.g. key locked inside trunk, battery dead since morning, engine overheating smoke...)"
                    className="w-full p-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-450 font-medium text-sm"
                  />
                </div>

                {/* AI Assistant widget suggestion snippet */}
                <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-2xl p-5 flex gap-4">
                  <Sparkles className="w-5.5 h-5.5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">AI Diagnostic Assist Recommend</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                      {form.serviceType === 'battery_jump'
                        ? 'Suggested: Discharged starter battery replacement diagnostic. Estimated repair duration: 10 mins.'
                        : 'Suggested: Nearby towing platform dispatch matching your City make dimensions.'}
                    </p>
                  </div>
                </div>

                {/* Upload Damage Photo Placeholder layout */}
                <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-700 block">Upload damage photo or video details</span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Supported formats: JPEG, PNG, MP4 up to 5MB</p>
                </div>

                {/* Bottom Actions Step 2 */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-[#0B132B] font-extrabold h-[54px] rounded-2xl text-sm transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={startScanning}
                    className="flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-[54px] rounded-2xl text-sm transition shadow shadow-orange-500/10"
                  >
                    Find Nearby Responders
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LIVE SCANNING / MAP UPDATES LOADER */}
            {step === 3 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-6">
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-[#FF6B00]/10 border-t-[#FF6B00] animate-spin" />
                  <Compass className="w-12 h-12 text-[#FF6B00] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Finding nearby mechanics...</h3>
                  <p className="text-xs text-slate-450 font-semibold mt-1">Scanning satellite positioning channels matching dispatch limit</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-sm mx-auto text-xs text-slate-500 font-bold leading-normal">
                  🔍 Scanning distance: {(scanningTime * 1.5).toFixed(1)} miles radius limit...
                </div>
              </div>
            )}

            {/* STEP 4: MECHANICS CHOICE & PRICE LEDGER CONFIRMATION */}
            {step === 4 && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pl-1">
                  <h3 className="text-base font-black text-[#0B132B] uppercase tracking-widest">Select Certified Mechanic</h3>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#FF6B00] hover:underline"
                  >
                    Change Parameters
                  </button>
                </div>

                {mechanics.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                    <p className="text-xs sm:text-sm text-slate-500 font-bold">No partner mechanics found near your coordinate. You can submit a public rescue request broadcast.</p>
                    <button
                      type="button"
                      onClick={() => submitRequest()}
                      disabled={submitting}
                      className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-12 px-6 rounded-xl text-xs transition"
                    >
                      {submitting ? 'Submitting Broadcast...' : 'Broadcast Rescue Request Anyway'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mechanics.map((m) => (
                      <div
                        key={m._id}
                        className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-[#FF6B00]/40 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 font-black text-sm">
                              {m.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-base font-black text-slate-900 leading-tight">
                                {m.businessName || m.name}
                              </h4>
                              <p className="text-xs text-slate-400 font-semibold mt-1">{m.name} · Certified Technician</p>
                              <div className="flex items-center gap-3.5 mt-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                <span className="flex items-center gap-0.5"><StarRating rating={m.rating} /></span>
                                <span>·</span>
                                <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5 text-[#FF6B00]" /> ~{m.estimatedArrivalMinutes} mins</span>
                                <span>·</span>
                                <span>{m.totalJobs} jobs finished</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end gap-2">
                            {m.pricing && (
                              <div className="text-lg font-black text-slate-900 flex items-baseline">
                                <span className="text-xs text-slate-400 font-bold mr-0.5">₹</span>
                                {m.pricing}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => submitRequest(m._id)}
                              disabled={submitting}
                              className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-11 px-5 rounded-xl text-xs transition flex-shrink-0"
                            >
                              {submitting ? 'Booking...' : 'Book Responder'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* General broadcast helper option */}
                    <button
                      type="button"
                      onClick={() => submitRequest()}
                      disabled={submitting}
                      className="w-full h-12 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center"
                    >
                      Broadcast to Any Free Nearby Mechanic
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* RIGHT SIDE STICKY PREVIEW CARD (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Transparent Pricing Estimate Widget */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 pl-0.5">Billing estimate</h4>
              
              <div className="space-y-3.5 text-xs text-slate-600 font-bold pb-5 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>Base diagnostic charge</span>
                  <span className="text-slate-900">{selectedService ? selectedService.price : '₹0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgency request fee</span>
                  <span className="text-slate-900">₹{serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & GST (18%)</span>
                  <span className="text-slate-900">₹{taxes}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 mb-5 pl-0.5">
                <span className="text-sm font-black text-slate-900">Estimated Total Cost</span>
                <span className="text-xl font-black text-[#FF6B00]">₹{totalCost}</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center gap-2 text-[10px] font-bold text-slate-450 uppercase tracking-wider justify-center text-center">
                <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Transparent checkout pricing guarantee</span>
              </div>
            </div>

            {/* Direct helpline hotline backup */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Emergency helpline</h4>
              <p className="text-xs text-slate-400 font-semibold mb-4 leading-normal">
                Can&apos;t connect to GPS signal? Dial our emergency response hotline directly.
              </p>
              <a
                href="tel:18005550199"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition shadow shadow-red-600/10"
              >
                <AlertCircle className="w-4 h-4 animate-bounce" /> Call SOS Desk
              </a>
            </div>

          </div>

        </div>

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

// Mini collapse check utility
function collapsedWidth(idx: number) {
  return false;
}
