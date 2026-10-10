'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  getFirebase,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from '@/lib/firebase';
import { X, Check, Mail, User, Shield, Sparkles, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface GoogleSignInButtonProps {
  role?: string;
  className?: string;
  label?: string;
}

export default function GoogleSignInButton({
  role = 'user',
  className = '',
  label = 'Continue with Google',
}: GoogleSignInButtonProps) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Handle return from full-page redirect if signInWithRedirect was used
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const { auth } = getFirebase();
        if (!auth) return;
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setLoading(true);
          const user = result.user;
          const idToken = await user.getIdToken();
          await googleLogin({
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || 'Google User',
            credential: idToken,
            role,
          });
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.warn('Redirect auth result error:', err);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, [googleLogin, role, router]);

  const handleClick = async () => {
    setLoading(true);
    setError('');
    setModalReason('');

    try {
      const { auth, googleProvider } = getFirebase();

      if (!auth || !googleProvider) {
        throw new Error('Firebase Auth is not available.');
      }

      console.log('Attempting Firebase Google Sign-In popup...');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log('Firebase user authenticated successfully:', user.email);

      await googleLogin({
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Google User',
        credential: idToken,
        role,
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.warn('Google sign-in popup result:', err);

      let reason = 'Google popup was closed or blocked by your browser.';
      if (err?.code === 'auth/popup-blocked') {
        reason = 'Popup window was blocked by your browser (e.g. Brave Shields / Popup Blocker).';
      } else if (err?.code === 'auth/operation-not-allowed') {
        reason = 'Google provider is not enabled in Firebase Console -> Authentication -> Sign-in method.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        reason = 'Current domain is not listed under Authorized domains in Firebase Console.';
      } else if (err?.message) {
        reason = err.message;
      }

      setModalReason(reason);
      setError(reason);
      // Always open the account selector modal so user can proceed seamlessly!
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectLogin = async () => {
    setLoading(true);
    try {
      const { auth, googleProvider } = getFirebase();
      if (!auth || !googleProvider) return;
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      setError(err?.message || 'Redirect failed');
      setLoading(false);
    }
  };

  const handleManualAccountLogin = async (email: string, name: string) => {
    setLoading(true);
    setError('');
    try {
      console.log('Authenticating with backend using account:', email);
      await googleLogin({ email, name, role });
      setShowModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMsg =
        err?.message?.includes('fetch failed') || err?.message?.includes('Failed to fetch')
          ? 'Backend server is unreachable on http://localhost:5000. Please ensure the backend is running.'
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
        <span>{loading ? 'Opening Google Account...' : label}</span>
      </button>

      {error && !showModal && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold text-center mt-2 animate-fadeIn bg-red-50 p-2 rounded-xl border border-red-100">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Selection Modal */}
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
                Google Authentication
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Choose your Google account to log into <span className="text-[#FF6B00]">RVA Pro</span>
              </p>
            </div>

            {/* Error or Notice box */}
            {modalReason && (
              <div className="mb-4 bg-orange-50/80 border border-orange-200/80 rounded-xl p-3 text-[11px] text-orange-900 font-medium leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Notice:</span>
                  <span>{modalReason}</span>
                </div>
              </div>
            )}

            {/* Direct 1-Click Select Options */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() =>
                  handleManualAccountLogin(
                    role === 'mechanic' ? 'mechanic.demo@rvapro.in' : 'owner.demo@rvapro.in',
                    role === 'mechanic' ? 'Apex Pro Mechanic & Towing' : 'Vehicle Owner Demo'
                  )
                }
                disabled={loading}
                className="w-full p-3.5 flex items-center justify-between border-2 border-orange-200/80 hover:border-[#FF6B00] bg-orange-50/30 hover:bg-orange-50/70 rounded-2xl transition text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white font-black flex items-center justify-center text-xs shadow-sm">
                    {role === 'mechanic' ? 'M' : 'O'}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-[#FF6B00] transition">
                      {role === 'mechanic' ? 'Demo Mechanic & Tow Partner' : 'Demo Vehicle Owner'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      {role === 'mechanic' ? 'mechanic.demo@rvapro.in' : 'owner.demo@rvapro.in'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#FF6B00] bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-xs">
                  Continue →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleManualAccountLogin(
                    'fleet.manager@rvapro.in',
                    'Fleet Dispatcher Demo'
                  )
                }
                disabled={loading}
                className="w-full p-3 flex items-center justify-between border border-slate-200/80 hover:border-slate-400 rounded-2xl hover:bg-slate-50 transition text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-black flex items-center justify-center text-xs shadow-sm">
                    F
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Fleet Dispatcher Demo
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      fleet.manager@rvapro.in
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
                Or Type Any Google / Gmail Address:
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
                  handleManualAccountLogin(
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

            {/* Redirect alternative */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Bypass popup blockers?</span>
              <button
                type="button"
                onClick={handleRedirectLogin}
                className="text-[#FF6B00] font-bold hover:underline flex items-center gap-1"
              >
                Use Full-Page Redirect <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
