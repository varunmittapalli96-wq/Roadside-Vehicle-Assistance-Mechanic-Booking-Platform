'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Wrench,
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
  Car,
  Truck,
  Building,
  Shield,
} from 'lucide-react';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'mechanic' ? 'mechanic' : 'user';

  // State matching all required fields
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole, // 'user' | 'mechanic' | 'tow' | 'fleet'
    referralCode: '',
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
    score: 0, // 0 = Weak, 1-2 = Medium, 3-4 = Strong
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
    // Simulate OTP delivery code
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

    setLoading(true);
    try {
      // Map local roles to backend registration role schemas
      const submitRole = form.role === 'fleet' ? 'user' : form.role;
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: submitRole,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Password progress bar color utilities
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
    <div className="w-full max-w-[620px] py-4">
      
      {/* Signup Card */}
      <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-10 shadow-xl hover:border-[#FF6B00]/25 transition-all duration-300 relative">
        
        {/* Header Area */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8A00] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Wrench className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              RVA <span className="text-[#FF6B00]">Pro</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">Create Your Account</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Join India&apos;s fastest roadside assistance network.
          </p>
        </div>

        {/* Account Type Segmented Controls */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">Select Account Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-[20px]">
            {[
              { id: 'user', label: 'Owner', icon: Car },
              { id: 'mechanic', label: 'Mechanic', icon: Wrench },
              { id: 'tow', label: 'Tow', icon: Truck },
              { id: 'fleet', label: 'Fleet', icon: Building },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = form.role === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setForm({ ...form, role: tab.id })}
                  className={`flex items-center gap-1.5 justify-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50/60 border border-red-100/50 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          {/* Row 1: Full Name & Email Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Full Name</label>
              <div className="relative">
                <input
                  className="w-full h-[54px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full h-[54px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Phone Input with OTP Verification Block */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Phone Number</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  className="w-full h-[54px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  disabled={otpVerified}
                  placeholder="+91 98765 43210"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              </div>
              
              {!otpVerified ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="h-[54px] px-4 border border-slate-200 hover:border-[#FF6B00] text-slate-700 font-bold text-xs uppercase tracking-wider rounded-[18px] bg-white transition hover:bg-slate-50 flex-shrink-0"
                >
                  Send OTP
                </button>
              ) : (
                <span className="h-[54px] px-4 bg-green-500/10 border border-green-500/20 text-[#22C55E] font-bold text-xs uppercase tracking-wider rounded-[18px] flex items-center justify-center gap-1.5 flex-shrink-0">
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
              <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">{otpError || "Code dispatched to your mobile. Enter '4321'"}</p>
            )}
          </div>

          {/* Row 2: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-[54px] pl-10 pr-10 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full h-[54px] pl-10 pr-10 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
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
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Strength: <span className="text-[#FF6B00] font-black">{strengthLabel}</span></span>
                <span>{passwordStrength.score}/4 Points</span>
              </div>
              <div className="w-full h-[4px] bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 pl-1 text-[10px] font-bold text-slate-400">
                <div className={`flex items-center gap-1.5 ${passwordStrength.hasLength ? 'text-[#22C55E]' : 'text-slate-350'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> 8+ Characters
                </div>
                <div className={`flex items-center gap-1.5 ${passwordStrength.hasUpper ? 'text-[#22C55E]' : 'text-slate-350'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> 1 Uppercase Letter
                </div>
                <div className={`flex items-center gap-1.5 ${passwordStrength.hasNumber ? 'text-[#22C55E]' : 'text-slate-350'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> 1 Numeric Value
                </div>
                <div className={`flex items-center gap-1.5 ${passwordStrength.hasSpecial ? 'text-[#22C55E]' : 'text-slate-350'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> 1 Special Character
                </div>
              </div>
            </div>
          )}

          {/* Referral Code */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Referral Code (Optional)</label>
            <div className="relative">
              <input
                className="w-full h-[54px] pl-10 pr-4 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm"
                value={form.referralCode}
                onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
                placeholder="RVA-FRIEND-50"
              />
              <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            </div>
          </div>

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
                <span>Create Secure Account</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
          <span className="relative z-10 bg-white px-4 text-xs font-black text-slate-400 uppercase tracking-widest">OR</span>
        </div>

        {/* Social signup buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button className="flex items-center justify-center h-11 border border-slate-200 hover:bg-slate-50 rounded-xl transition text-xs font-black text-[#0B132B]" aria-label="Signup with Google">
            Google
          </button>
          <button className="flex items-center justify-center h-11 border border-slate-200 hover:bg-slate-50 rounded-xl transition text-xs font-black text-[#0B132B]" aria-label="Signup with Apple">
            Apple
          </button>
          <button className="flex items-center justify-center h-11 border border-slate-200 hover:bg-slate-50 rounded-xl transition text-xs font-black text-[#0B132B]" aria-label="Signup with Microsoft">
            Microsoft
          </button>
        </div>

        {/* Trust elements list */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#FF6B00]" /> 256-bit Encryption</div>
          <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#FF6B00]" /> Secure Auth</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" /> Verified Network</div>
          <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#FF6B00]" /> Nationwide</div>
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
      
      {/* Special Background: Premium lighting, grid lines, and orange blur blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft radial gradients and glowing circles */}
        <div className="absolute top-[20%] left-[15%] w-[450px] h-[450px] rounded-full bg-[#FF6B00]/5 blur-[100px] opacity-70 animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] rounded-full bg-[#F59E0B]/5 blur-[120px] opacity-60" />
        
        {/* Very subtle mesh background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-50/50 to-slate-100/30" />
        
        {/* Faint grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #6b7280 1px, transparent 1px), linear-gradient(to bottom, #6b7280 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Centered Premium Sign Up Form Card */}
      <Suspense fallback={<div className="text-slate-400 font-bold">Loading Registration Form...</div>}>
        <RegisterForm />
      </Suspense>

    </div>
  );
}
