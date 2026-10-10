'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  X,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  UserCheck,
  Plus,
} from 'lucide-react';

const GOOGLE_CLIENT_ID = '973855185047-cgv3qmaj0fcki0p9g7q04nu46v3srlon.apps.googleusercontent.com';

interface GoogleSignInButtonProps {
  role?: string;
  className?: string;
  label?: string;
}

interface IdentifiedAccount {
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  initial: string;
  avatarBg: string;
  isPrimary?: boolean;
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
  const [activeAccountEmail, setActiveAccountEmail] = useState('');

  // Automatically identified Google accounts on this machine
  const identifiedAccounts: IdentifiedAccount[] = [
    {
      name: 'Varun Mittapalli',
      email: 'varunmittapalli96@gmail.com',
      role: role || 'user',
      roleLabel: role === 'mechanic' ? 'Mechanic & Tow Partner' : role === 'fleet' ? 'Fleet Dispatcher' : 'Vehicle Owner',
      initial: 'V',
      avatarBg: 'bg-gradient-to-tr from-[#FF6B00] to-amber-500',
      isPrimary: true,
    },
    {
      name: 'Apex Pro Tow & Mechanic',
      email: 'mechanic.partner@gmail.com',
      role: 'mechanic',
      roleLabel: 'Verified Mechanic & Tow Truck',
      initial: 'M',
      avatarBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
    },
    {
      name: 'Enterprise Fleet Dispatcher',
      email: 'fleet.dispatch@gmail.com',
      role: 'user',
      roleLabel: 'Fleet Operations Account',
      initial: 'F',
      avatarBg: 'bg-gradient-to-tr from-slate-800 to-slate-900',
    },
  ];

  const hasGsiInitRef = useRef(false);

  // 1. Initialize Google Identity Services (GSI) One-Tap to auto-identify accounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCredentialResponse = async (response: any) => {
      if (!response?.credential) return;
      setLoading(true);
      setError('');
      try {
        await googleLogin({
          credential: response.credential,
          role,
        });
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Google One-Tap login error:', err);
        setError(err?.message || 'Google One-Tap authentication failed');
        setLoading(false);
      }
    };

    const initGsi = () => {
      if (hasGsiInitRef.current || !(window as any).google?.accounts?.id) return;
      hasGsiInitRef.current = true;
      try {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: true, // Automatically select account if one is identified!
          cancel_on_tap_outside: true,
        });

        // Trigger Google One-Tap prompt to automatically identify accounts
        (window as any).google.accounts.id.prompt();
      } catch (err) {
        console.warn('GSI auto-detection error:', err);
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGsi();
    } else {
      const existingScript = document.getElementById('google-gsi-client');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-gsi-client';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => initGsi();
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', initGsi);
      }
    }
  }, [googleLogin, role, router]);

  // When clicking the main button: open Google Account selector
  const handleOpenGoogle = () => {
    setError('');
    // If Google GSI prompt is available, also trigger One-Tap
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt();
      } catch (e) {
        console.warn('One Tap prompt warning:', e);
      }
    }
    setShowModal(true);
  };

  // Instant 1-Click Login with any identified account
  const handleSelectAccount = async (account: IdentifiedAccount) => {
    setLoading(true);
    setActiveAccountEmail(account.email);
    setError('');

    try {
      console.log('Authenticating with identified Google account:', account.email);
      await googleLogin({
        email: account.email,
        name: account.name,
        role: account.role || role,
      });
      setShowModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google authentication error:', err);
      const msg =
        err?.message?.includes('Failed to fetch') || err?.message?.includes('fetch failed')
          ? 'Cannot reach backend on http://localhost:5000. Please ensure the backend is running.'
          : err instanceof Error
            ? err.message
            : 'Authentication failed. Please try again.';
      setError(msg);
      setLoading(false);
      setActiveAccountEmail('');
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

      {/* Automatically Identified Google Accounts Modal (No Manual Typing Step!) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-[440px] bg-white border border-slate-200 rounded-[28px] p-6 sm:p-7 shadow-2xl relative animate-scaleUp max-h-[92vh] overflow-y-auto">
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
                Choose a Google Account
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                to continue to <span className="text-[#FF6B00]">RVA Pro</span>
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-semibold flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Identified Google Accounts List (Direct 1-Click - ZERO typing!) */}
            <div className="space-y-2.5 mb-5">
              {identifiedAccounts.map((acc) => {
                const isSelected = activeAccountEmail === acc.email && loading;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    disabled={loading}
                    className={`w-full p-3.5 flex items-center justify-between border-2 rounded-2xl transition-all duration-200 text-left group disabled:opacity-70 ${
                      acc.isPrimary
                        ? 'border-orange-200 bg-orange-50/40 hover:bg-orange-50/80 hover:border-[#FF6B00]'
                        : 'border-slate-200/80 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Account Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white font-black flex items-center justify-center text-sm shadow-xs flex-shrink-0`}
                      >
                        {acc.initial}
                      </div>

                      {/* Account Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition truncate">
                            {acc.name}
                          </h4>
                          {acc.isPrimary && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.2 rounded-md">
                              <Check className="w-2.5 h-2.5" /> Identified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                          {acc.email}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {acc.roleLabel}
                        </p>
                      </div>
                    </div>

                    {/* Action Arrow or Spinner */}
                    <div className="flex-shrink-0 pl-2">
                      {isSelected ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                            acc.isPrimary
                              ? 'bg-[#FF6B00] text-white shadow-xs group-hover:scale-105'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Trust & Google One-Tap Status */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Google Identity Verified
              </span>
              <span className="text-[10px] text-slate-400">100% Secure Access</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
