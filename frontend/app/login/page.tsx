'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Check,
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Centered Premium Sign In Card */}
      <div className="w-full max-w-[480px] bg-white border border-slate-200/60 rounded-[32px] p-8 sm:p-12 shadow-xl hover:border-[#FF6B00]/20 transition-all duration-300 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8A00] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Wrench className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              RVA <span className="text-[#FF6B00]">Pro</span>
            </span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-500 font-semibold">Sign in to access emergency roadside assistance.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50/60 border border-red-100/50 text-red-700 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                className="w-full h-[58px] pl-12 pr-5 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full h-[58px] pl-12 pr-12 border border-slate-200 rounded-[18px] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none transition bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              
              {/* Eye toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-1">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-[#FF6B00] hover:underline">Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-[56px] bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-[18px] font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 mt-8"
            disabled={loading}
          >
            {loading ? (
              <span>Establishing Secure Access...</span>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Trust elements list */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-2.5">
          {[
            'Bank-grade security standards',
            'Encrypted credentials authentication',
            'Verified mechanics & operators only',
            'GDPR & local privacy compliant',
            '24/7 client dispatch support desk',
          ].map((trust) => (
            <div key={trust} className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{trust}</span>
            </div>
          ))}
        </div>

        {/* Redirect register links */}
        <div className="text-center mt-8 pt-4 border-t border-slate-100">
          <span className="text-xs sm:text-sm font-semibold text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#FF6B00] font-bold hover:underline transition-all">
              Register
            </Link>
          </span>
        </div>

      </div>

    </div>
  );
}
