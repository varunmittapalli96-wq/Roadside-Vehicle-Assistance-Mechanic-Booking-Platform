'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { X, Check, Mail, User, Shield, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

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
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize official Google Identity Services if client ID is configured
  useEffect(() => {
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            setLoading(true);
            setError('');
            try {
              await googleLogin({ credential: response.credential, role });
              router.push('/dashboard');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Google sign-in failed');
            } finally {
              setLoading(false);
            }
          },
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [clientId, googleLogin, role, router]);

  const handleClick = () => {
    if (clientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setShowModal(true);
    }
  };

  const handleAccountSelect = async (email: string, name: string) => {
    setLoading(true);
    setError('');
    try {
      await googleLogin({ email, name, role });
      setShowModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      const errorMsg =
        err?.message?.includes('fetch failed') || err?.message?.includes('Failed to fetch')
          ? 'Backend server is not running on http://localhost:5000. Please start the backend (npm start in backend folder).'
          : err instanceof Error
            ? err.message
            : 'Authentication failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full h-[52px] bg-white hover:bg-slate-50/90 text-slate-700 border border-slate-200/90 rounded-[18px] font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:border-slate-300 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
        ) : (
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
        )}
        <span>{loading ? 'Signing in with Google...' : label}</span>
      </button>

      {error && !showModal && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold text-center mt-2 animate-fadeIn bg-red-50 p-2 rounded-xl border border-red-100">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Account Selector Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-[28px] p-6 sm:p-7 shadow-2xl relative animate-scaleUp">
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

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
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
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Choose an account to continue to <span className="text-[#FF6B00]">RVA Pro</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick 1-Click Accounts */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleAccountSelect('varun@gmail.com', 'Varun Mittapalli')}
                disabled={loading}
                className="w-full p-3.5 flex items-center justify-between border-2 border-orange-200/80 hover:border-[#FF6B00] bg-orange-50/30 hover:bg-orange-50/70 rounded-2xl transition text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
                    V
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition">
                      Continue as Varun Mittapalli
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold">varun@gmail.com</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#FF6B00] bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-xs">
                  Sign In →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAccountSelect(
                    role === 'mechanic' ? 'apex.towing@gmail.com' : 'rahul.driver@gmail.com',
                    role === 'mechanic' ? 'Apex Towing & Repair' : 'Rahul Sharma'
                  )
                }
                disabled={loading}
                className="w-full p-3 flex items-center justify-between border border-slate-200/80 hover:border-slate-400 rounded-2xl hover:bg-slate-50 transition text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-black flex items-center justify-center text-xs shadow-sm">
                    {role === 'mechanic' ? 'A' : 'R'}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {role === 'mechanic' ? 'Apex Towing & Repair' : 'Rahul Sharma'}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {role === 'mechanic' ? 'apex.towing@gmail.com' : 'rahul.driver@gmail.com'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-800">
                  Select →
                </span>
              </button>
            </div>

            {/* Custom Google Account Input */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Or Type Any Gmail Address:
              </label>
              <div className="space-y-1.5 mb-2.5">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Varun M)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#FF6B00]"
                />
                <input
                  type="email"
                  placeholder="your-name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#FF6B00]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!customEmail.trim()) {
                    setError('Please enter your Gmail address');
                    return;
                  }
                  handleAccountSelect(
                    customEmail,
                    customName || customEmail.split('@')[0]
                  );
                }}
                disabled={!customEmail.trim() || loading}
                className="w-full h-10 bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded-xl font-bold text-xs flex items-center justify-center transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In with This Account →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Global declaration for window.google
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: any) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}
