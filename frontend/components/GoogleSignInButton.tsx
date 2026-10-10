'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  X,
  Loader2,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface GoogleSignInButtonProps {
  role?: string;
  className?: string;
  label?: string;
}

export default function GoogleSignInButton({
  role = 'user',
  className = '',
  label = 'Sign in with Google',
}: GoogleSignInButtonProps) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  // When clicking the main button, open the Google Sign-In account selector
  const handleOpenGoogle = () => {
    setError('');
    setShowModal(true);
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);
  };

  // Authenticate user with their Google email
  const handleGoogleSubmit = async (selectedEmail?: string, selectedName?: string) => {
    const targetEmail = (selectedEmail || email).trim();
    const targetName = (selectedName || name).trim() || targetEmail.split('@')[0];

    if (!targetEmail) {
      setError('Please enter your Google / Gmail address');
      emailInputRef.current?.focus();
      return;
    }

    if (!targetEmail.includes('@')) {
      setError('Please enter a valid email address (e.g. name@gmail.com)');
      emailInputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Authenticating with Google Account:', targetEmail);
      await googleLogin({
        email: targetEmail,
        name: targetName,
        role,
      });
      setShowModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google authentication error:', err);
      const msg =
        err?.message?.includes('Failed to fetch') || err?.message?.includes('fetch failed')
          ? 'Cannot connect to backend server on http://localhost:5000. Make sure the backend is running.'
          : err instanceof Error
            ? err.message
            : 'Authentication failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Primary Google Sign-In Button */}
      <button
        type="button"
        onClick={handleOpenGoogle}
        disabled={loading}
        className={`w-full h-[52px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-[18px] font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:border-slate-300 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Outside Error Notice */}
      {error && !showModal && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-semibold text-center mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Sign-In Account Selector Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[28px] p-6 sm:p-7 shadow-2xl relative animate-scaleUp max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setError('');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Choose or enter your Google account to log into <span className="text-[#FF6B00]">RVA Pro</span>
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-semibold flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Form to enter any Google/Gmail Account */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGoogleSubmit();
              }}
              className="mb-5 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Google / Gmail Address:
                </label>
                <div className="relative">
                  <input
                    ref={emailInputRef}
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] bg-white transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Varun Mittapalli)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] bg-white transition"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm hover:shadow-orange-500/20 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    <span>Continue with Google Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Role Profiles */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">
                Or 1-Click Demo Profiles:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleSubmit(
                      role === 'mechanic' ? 'mechanic.demo@gmail.com' : 'driver.demo@gmail.com',
                      role === 'mechanic' ? 'Apex Pro Mechanic & Tow' : 'Vehicle Driver Demo'
                    )
                  }
                  disabled={loading}
                  className="p-3 bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition group disabled:opacity-50"
                >
                  <span className="block text-[11px] font-bold text-[#FF6B00]">
                    {role === 'mechanic' ? 'Mechanic & Tow' : 'Vehicle Owner'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate block">
                    {role === 'mechanic' ? 'mechanic.demo@gmail.com' : 'driver.demo@gmail.com'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleSubmit('fleet.demo@gmail.com', 'Fleet Dispatcher Demo')}
                  disabled={loading}
                  className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition group disabled:opacity-50"
                >
                  <span className="block text-[11px] font-bold text-slate-800">Fleet Dispatcher</span>
                  <span className="text-[10px] text-slate-400 font-medium truncate block">
                    fleet.demo@gmail.com
                  </span>
                </button>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct Google Account Authentication Active</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
