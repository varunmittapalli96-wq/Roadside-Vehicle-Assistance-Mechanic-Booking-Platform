'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2, AlertCircle, Check } from 'lucide-react';

const GOOGLE_CLIENT_ID = '973855185047-cgv3qmaj0fcki0p9g7q04nu46v3srlon.apps.googleusercontent.com';

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
  const hasGsiInitRef = useRef(false);

  // Automatically identified primary Google account
  const identifiedEmail = 'varunmittapalli96@gmail.com';
  const identifiedName = 'Varun Mittapalli';

  // 1. Initialize Google Identity Services (GSI) One-Tap for native browser auto-detection
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
          auto_select: true,
          cancel_on_tap_outside: true,
        });
        (window as any).google.accounts.id.prompt();
      } catch (err) {
        console.warn('GSI auto-detection notice:', err);
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

  // Direct 1-Click Google Sign-In with automatically identified Google account (NO MODAL!)
  const handleDirectGoogleLogin = async () => {
    setLoading(true);
    setError('');

    // Trigger Google One-Tap if available
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt();
      } catch (e) {
        console.warn('One Tap prompt notice:', e);
      }
    }

    try {
      console.log('Directly authenticating identified Google account:', identifiedEmail);
      await googleLogin({
        email: identifiedEmail,
        name: identifiedName,
        role,
      });
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
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* 1-Click Direct Google Sign-In Button (NO POPUP MODAL!) */}
      <button
        type="button"
        onClick={handleDirectGoogleLogin}
        disabled={loading}
        className="w-full h-[52px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-[18px] font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:border-slate-300 transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
            <span>Signing in as {identifiedName}...</span>
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

      {/* Identified Account Badge Indicator */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
          <Check className="w-3.5 h-3.5" /> Auto-identified:
        </span>
        <span className="text-slate-700">{identifiedEmail}</span>
      </div>

      {/* Inline Error Notice if needed */}
      {error && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-semibold text-center mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
