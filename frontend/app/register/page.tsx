'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import {
  Wrench,
  Truck,
  Car,
  Building,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  ArrowRight,
  Mail,
  KeyRound,
  User,
  Phone,
  Check,
  CheckCircle2,
  Globe,
  Plus,
  MapPin,
  FileText,
  Shield,
  Zap,
  Fuel,
  Info,
  CircleDot,
  CheckSquare,
  Square,
} from 'lucide-react';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const roleParam = searchParams.get('role');
  const initialRole =
    roleParam === 'mechanic' || roleParam === 'tow'
      ? 'mechanic'
      : roleParam === 'fleet'
        ? 'fleet'
        : 'user';

  // State matching role-specific requirements
  const [form, setForm] = useState({
    // Common fields
    role: initialRole, // 'user' | 'mechanic' | 'fleet'
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Mechanic & Towing Partner specific fields
    businessName: '',
    address: '',
    experience: '3',
    licenseNumber: '',
    services: ['breakdown_repair', 'battery_jump_start', 'flat_tire_repair', 'towing'],
    hasTowing: true,
    towTruckType: 'flatbed',
    towingRate: '800',
    bio: '',

    // Vehicle Owner specific fields
    vehicleType: 'car',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    referralCode: '',

    // Fleet specific fields
    companyName: '',
    fleetSize: '6-20',
    operatingCity: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Phone OTP Simulation States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Password Checklist State
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    score: 0,
  });

  // Calculate Password Strength in real-time
  useEffect(() => {
    const pw = form.password;
    const hasLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);

    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    setPasswordStrength({
      hasLength,
      hasUpper,
      hasNumber,
      hasSpecial,
      score,
    });
  }, [form.password]);

  const handleSendOTP = () => {
    if (!form.phone.trim()) {
      setOtpError('Enter a valid phone number');
      return;
    }
    setOtpError('');
    setOtpSent(true);
    alert('Simulated Verification SMS: Your OTP code is 4321');
  };

  const handleVerifyOTP = () => {
    if (otpCode === '4321') {
      setOtpVerified(true);
      setOtpSent(false);
      setOtpError('');
    } else {
      setOtpError('Incorrect code. Try "4321"');
    }
  };

  const toggleService = (serviceId: string) => {
    const exists = form.services.includes(serviceId);
    let updatedServices: string[];
    if (exists) {
      updatedServices = form.services.filter((s) => s !== serviceId);
    } else {
      updatedServices = [...form.services, serviceId];
    }

    // Keep towing checkbox in sync with towing service
    const hasTowingNow = serviceId === 'towing' ? !exists : form.hasTowing;

    setForm({
      ...form,
      services: updatedServices,
      hasTowing: hasTowingNow,
    });
  };

  const handleTowingToggle = (enabled: boolean) => {
    let updatedServices = [...form.services];
    if (enabled && !updatedServices.includes('towing')) {
      updatedServices.push('towing');
    } else if (!enabled) {
      updatedServices = updatedServices.filter((s) => s !== 'towing');
    }
    setForm({
      ...form,
      hasTowing: enabled,
      services: updatedServices,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password matching the checklist rules');
      return;
    }

    // Role-specific validation
    if (form.role === 'mechanic') {
      if (!form.businessName.trim()) {
        setError('Please provide your workshop, garage, or towing business name');
        return;
      }
      if (!form.address.trim()) {
        setError('Please provide your base workshop address or operating city');
        return;
      }
      if (!form.licenseNumber.trim()) {
        setError('Please enter your trade license or certification ID (or "PENDING")');
        return;
      }
    }

    if (form.role === 'fleet' && !form.companyName.trim()) {
      setError('Please provide your fleet or company name');
      return;
    }

    setLoading(true);
    try {
      if (form.role === 'mechanic') {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: 'mechanic',
          businessName: form.businessName,
          address: form.address,
          experience: Number(form.experience) || 3,
          licenseNumber: form.licenseNumber,
          services: form.services,
          hasTowing: form.hasTowing,
          towTruckType: form.hasTowing ? form.towTruckType : '',
          towingRate: Number(form.towingRate) || 800,
          bio: form.bio,
        });
      } else if (form.role === 'fleet') {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: 'user',
          companyName: form.companyName,
          fleetSize: form.fleetSize,
          address: form.operatingCity || 'Bangalore',
        });
      } else {
        // Vehicle Owner
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: 'user',
          vehicleType: form.vehicleType,
          vehicleMake: form.vehicleMake,
          vehicleModel: form.vehicleModel,
          licensePlate: form.licensePlate,
          referralCode: form.referralCode,
        });
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strengthColor =
    passwordStrength.score <= 1
      ? 'bg-red-500'
      : passwordStrength.score === 2 || passwordStrength.score === 3
        ? 'bg-amber-500'
        : 'bg-[#22C55E]';

  const strengthLabel =
    passwordStrength.score <= 1
      ? 'Weak'
      : passwordStrength.score === 2 || passwordStrength.score === 3
        ? 'Medium'
        : 'Strong';

  return (
    <div className="w-full max-w-[680px] py-6">
      {/* Signup Card */}
      <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-10 shadow-xl hover:border-[#FF6B00]/25 transition-all duration-300 relative">
        {/* Header Area */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8A00] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Wrench className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              RVA <span className="text-[#FF6B00]">Pro</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Join India&apos;s fastest emergency roadside & mechanic booking network.
          </p>
        </div>

        {/* Account Type Segmented Controls (Towing Merged into Mechanic!) */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">
            Select Account Type
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-[20px]">
            {[
              {
                id: 'user',
                label: 'Vehicle Owner',
                short: 'Owner',
                icon: Car,
                desc: 'Driver & car owner',
              },
              {
                id: 'mechanic',
                label: 'Mechanic & Towing',
                short: 'Mechanic & Tow',
                icon: Wrench,
                desc: 'Garage & tow trucks',
              },
              {
                id: 'fleet',
                label: 'Fleet Manager',
                short: 'Fleet',
                icon: Building,
                desc: 'Corporate fleets',
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = form.role === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setForm({ ...form, role: tab.id })}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-center">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Role Focus Banner */}
        {form.role === 'mechanic' ? (
          <div className="mb-6 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 border border-orange-200/60 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-[#0B132B] block">
                🛠️ Mechanic & Towing Partner Terminal
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed font-medium">
                Register your workshop, mobile repair van, or towing truck. Towing is integrated directly into your mechanic profile so stranded drivers can book breakdown repair and tow dispatch from you.
              </p>
            </div>
          </div>
        ) : form.role === 'fleet' ? (
          <div className="mb-6 bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50/40 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Building className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-[#0B132B] block">
                🏢 Enterprise Fleet Account
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed font-medium">
                Centralized roadside coverage and priority emergency dispatch for business fleets, delivery vans, and commercial vehicles.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50/40 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-[#0B132B] block">
                🚗 Vehicle Owner Account
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed font-medium">
                Instant access to 24/7 on-demand roadside assistance, verified mechanics, battery jump-start, flatbed towing, and transparent upfront pricing.
              </p>
            </div>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          {/* Section: Contact & Basic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                {form.role === 'mechanic'
                  ? 'Technician / Owner Name'
                  : form.role === 'fleet'
                    ? 'Fleet Manager Name'
                    : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder={form.role === 'mechanic' ? 'Rajesh Kumar' : 'John Doe'}
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Phone Input with OTP Verification Block */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  disabled={otpVerified}
                  placeholder="+91 98765 43210"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              {!otpVerified ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="h-[52px] px-4 border border-slate-200 hover:border-[#FF6B00] text-slate-700 font-bold text-xs uppercase tracking-wider rounded-[18px] bg-white transition hover:bg-slate-50 flex-shrink-0"
                >
                  Send OTP
                </button>
              ) : (
                <span className="h-[52px] px-4 bg-green-500/10 border border-green-500/20 text-[#22C55E] font-bold text-xs uppercase tracking-wider rounded-[18px] flex items-center justify-center gap-1.5 flex-shrink-0">
                  <Check className="w-4 h-4" /> Verified
                </span>
              )}
            </div>

            {/* Simulated OTP Verify Input field */}
            {otpSent && !otpVerified && (
              <div className="mt-2 flex gap-2 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Enter Code (4321)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="flex-1 h-[44px] px-4 border border-slate-200 rounded-[12px] text-sm focus:ring-[#FF6B00] outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  className="px-4 bg-[#FF6B00] text-white text-xs font-bold uppercase rounded-[12px] hover:bg-[#e05e00]"
                >
                  Verify Code
                </button>
              </div>
            )}
            {(otpError || otpSent) && (
              <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">
                {otpError || "Code dispatched to your mobile. Enter '4321'"}
              </p>
            )}
          </div>

          {/* ========================================================================= */}
          {/* ROLE SPECIFIC FIELDS: MECHANIC & TOWING */}
          {/* ========================================================================= */}
          {form.role === 'mechanic' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#FF6B00]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Workshop & Credentials
                </h3>
              </div>

              {/* Row: Workshop Name & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Workshop / Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      required
                      placeholder="e.g. Apex Auto Care & 24/7 Towing"
                    />
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Base Address / City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      required
                      placeholder="e.g. MG Road, Indiranagar, Bangalore"
                    />
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Row: Experience & License */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 font-medium text-sm"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    >
                      <option value="1">1 Year Experience</option>
                      <option value="2">2 Years Experience</option>
                      <option value="3">3 - 5 Years Experience</option>
                      <option value="6">6 - 10 Years Experience</option>
                      <option value="12">10+ Years Master Tech</option>
                    </select>
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    License / Cert ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm uppercase"
                      value={form.licenseNumber}
                      onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                      required
                      placeholder="e.g. MECH-2024-8821"
                    />
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Merged Towing & Recovery Card */}
              <div className="border border-orange-200/80 bg-orange-50/40 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        Towing & Recovery Capabilities
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Enable if you own a tow truck or offer vehicle recovery
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.hasTowing}
                      onChange={(e) => handleTowingToggle(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                  </label>
                </div>

                {form.hasTowing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-orange-200/50 animate-fadeIn">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tow Truck Type
                      </label>
                      <select
                        className="w-full h-[44px] px-3 border border-orange-200 rounded-xl bg-white text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#FF6B00]"
                        value={form.towTruckType}
                        onChange={(e) => setForm({ ...form, towTruckType: e.target.value })}
                      >
                        <option value="flatbed">Flatbed Hydraulic Tow Truck</option>
                        <option value="wheel_lift">Wheel-Lift / Under-Lift Truck</option>
                        <option value="heavy_duty">Integrated Heavy Recovery Truck</option>
                        <option value="standard">Standard Tow Van / Recovery Dolly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Base Towing Rate (₹)
                      </label>
                      <input
                        type="number"
                        className="w-full h-[44px] px-3 border border-orange-200 rounded-xl bg-white text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#FF6B00]"
                        value={form.towingRate}
                        onChange={(e) => setForm({ ...form, towingRate: e.target.value })}
                        placeholder="800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Services Offered Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">
                  Services You Offer
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'breakdown_repair', label: 'Breakdown Repair', icon: Wrench },
                    { id: 'towing', label: 'Towing & Recovery', icon: Truck },
                    { id: 'battery_jump_start', label: 'Battery Jump-Start', icon: Zap },
                    { id: 'flat_tire_repair', label: 'Flat Tire Repair', icon: CircleDot },
                    { id: 'fuel_delivery', label: 'Fuel Delivery', icon: Fuel },
                    { id: 'lockout', label: 'Lockout Assist', icon: KeyRound },
                  ].map((service) => {
                    const isSelected = form.services.includes(service.id);
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#FF6B00]/10 border-[#FF6B00] text-[#FF6B00]'
                            : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{service.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                  Bio / Specialization (Optional)
                </label>
                <textarea
                  className="w-full h-[76px] p-3 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-xs resize-none"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="e.g. Certified mechanic shop with hydraulic flatbed towing truck available 24/7 for highway and city emergencies."
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ROLE SPECIFIC FIELDS: VEHICLE OWNER */}
          {/* ========================================================================= */}
          {form.role === 'user' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Primary Vehicle Details (Optional)
                </h3>
              </div>

              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-3">
                <p className="text-[11px] text-slate-500 font-medium">
                  Adding your primary car or bike now helps mechanics dispatch the right tools and towing equipment immediately when you request assistance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      className="w-full h-[46px] px-3 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#FF6B00]"
                      value={form.vehicleType}
                      onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                    >
                      <option value="car">Car / Sedan</option>
                      <option value="suv">SUV / MUV</option>
                      <option value="bike">Two-Wheeler / Bike</option>
                      <option value="commercial">Commercial / Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Make & Model
                    </label>
                    <input
                      className="w-full h-[46px] px-3 border border-slate-200 rounded-xl bg-white text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#FF6B00]"
                      value={form.vehicleModel}
                      onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
                      placeholder="e.g. Hyundai Creta"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      License Plate No.
                    </label>
                    <input
                      className="w-full h-[46px] px-3 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#FF6B00] uppercase"
                      value={form.licensePlate}
                      onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                      placeholder="e.g. KA 01 AB 1234"
                    />
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                  Referral Code (Optional)
                </label>
                <div className="relative">
                  <input
                    className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                    value={form.referralCode}
                    onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
                    placeholder="RVA-FRIEND-50"
                  />
                  <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ROLE SPECIFIC FIELDS: FLEET MANAGER */}
          {/* ========================================================================= */}
          {form.role === 'fleet' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Fleet Organization Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Company / Fleet Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-[52px] px-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    required
                    placeholder="e.g. QuickMove Logistics India Pvt Ltd"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                    Fleet Size
                  </label>
                  <select
                    className="w-full h-[52px] px-3 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 font-medium text-sm"
                    value={form.fleetSize}
                    onChange={(e) => setForm({ ...form, fleetSize: e.target.value })}
                  >
                    <option value="1-5">1 - 5 Vehicles</option>
                    <option value="6-20">6 - 20 Vehicles</option>
                    <option value="21-50">21 - 50 Vehicles</option>
                    <option value="50+">50+ Heavy Fleet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                  Primary Operating Region / City
                </label>
                <div className="relative">
                  <input
                    className="w-full h-[52px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                    value={form.operatingCity}
                    onChange={(e) => setForm({ ...form, operatingCity: e.target.value })}
                    placeholder="e.g. Bangalore, Karnataka"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PASSWORD SECTION */}
          {/* ========================================================================= */}
          <div className="pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-[52px] pl-10 pr-10 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full h-[52px] pl-10 pr-10 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                  />
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Password Strength Indicator */}
            {form.password.length > 0 && (
              <div className="mt-3 bg-slate-50/60 border border-slate-100 p-3.5 rounded-2xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>
                    Strength: <span className="text-[#FF6B00] font-black">{strengthLabel}</span>
                  </span>
                  <span>{passwordStrength.score}/4 Points</span>
                </div>
                <div className="w-full h-[4px] bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColor}`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-y-1 gap-x-4 pl-1 text-[10px] font-bold text-slate-400">
                  <div
                    className={`flex items-center gap-1.5 ${passwordStrength.hasLength ? 'text-[#22C55E]' : 'text-slate-350'}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 8+ Characters
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${passwordStrength.hasUpper ? 'text-[#22C55E]' : 'text-slate-350'}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1 Uppercase Letter
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${passwordStrength.hasNumber ? 'text-[#22C55E]' : 'text-slate-350'}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1 Numeric Value
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${passwordStrength.hasSpecial ? 'text-[#22C55E]' : 'text-slate-350'}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1 Special Character
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Partner Verification Notice for Mechanic */}
          {form.role === 'mechanic' && (
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex items-center gap-2 text-amber-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Partner profiles are activated immediately after administrative verification.
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-[54px] bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-[18px] font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 pt-1"
            disabled={loading}
          >
            {loading ? (
              <span>Creating secure profile...</span>
            ) : (
              <>
                <span>
                  {form.role === 'mechanic'
                    ? 'Register Mechanic & Towing Partner'
                    : form.role === 'fleet'
                      ? 'Register Commercial Fleet Account'
                      : 'Create Vehicle Owner Account'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
          <span className="relative z-10 bg-white px-4 text-xs font-black text-slate-400 uppercase tracking-widest">
            OR
          </span>
        </div>

        {/* Google Signup Button */}
        <div className="space-y-3">
          <GoogleSignInButton
            role={form.role === 'fleet' ? 'user' : form.role}
            label={`Sign up with Google as ${form.role === 'mechanic' ? 'Mechanic & Tow Partner' : form.role === 'fleet' ? 'Fleet Manager' : 'Vehicle Owner'}`}
          />
        </div>

        {/* Trust elements list */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#FF6B00]" /> 256-bit Encryption
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#FF6B00]" /> Secure Auth
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" /> Verified Network
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#FF6B00]" /> Nationwide
          </div>
        </div>

        {/* Redirect sign in */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <span className="text-xs sm:text-sm font-semibold text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF6B00] font-bold hover:underline transition-all">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA] text-[#111827] relative overflow-hidden font-sans selection:bg-[#FF6B00]/10 selection:text-[#FF6B00]">
      {/* Background illumination */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-[450px] h-[450px] rounded-full bg-[#FF6B00]/5 blur-[100px] opacity-70 animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] rounded-full bg-[#F59E0B]/5 blur-[120px] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-50/50 to-slate-100/30" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #6b7280 1px, transparent 1px), linear-gradient(to bottom, #6b7280 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Centered Registration Card */}
      <Suspense fallback={<div className="text-slate-400 font-bold">Loading Registration Form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
