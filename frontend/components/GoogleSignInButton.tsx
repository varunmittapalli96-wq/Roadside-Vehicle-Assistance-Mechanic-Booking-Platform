'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getFirebase, signInWithPopup } from '@/lib/firebase';
import { Loader2, AlertCircle } from 'lucide-react';

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
  const tokenClientRef = useRef<any>(null);

  // Initialize Google Identity Services (GSI)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setupGoogleServices = () => {
      // 1. Setup OAuth 2.0 Token Client for opening the Google Account Chooser pop-out window
      if ((window as any).google?.accounts?.oauth2) {
        try {
          tokenClientRef.current = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile openid',
            prompt: 'select_account',
            callback: async (tokenResponse: any) => {
              if (tokenResponse?.error) {
                console.warn('Google pop-out response error:', tokenResponse);
                setLoading(false);
                if (tokenResponse.error !== 'access_denied') {
                  setError(tokenResponse.error_description || tokenResponse.error);
                }
                return;
              }

              if (tokenResponse?.access_token) {
                try {
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });
                  const profile = await res.json();
                  if (profile?.email) {
                    await googleLogin({
                      email: profile.email,
                      name: profile.name || profile.email.split('@')[0],
                      role,
                    });
                    router.push('/dashboard');
                    return;
                  }
                } catch (fetchErr: any) {
                  console.error('Failed to fetch userinfo from Google:', fetchErr);
                  setError('Failed to fetch Google profile. Please try again.');
                  setLoading(false);
                }
              }
            },
          });
        } catch (e) {
          console.warn('Error initializing OAuth2 Token Client:', e);
        }
      }

      // 2. Setup Google Identity Services One-Tap / Credential response
      if ((window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response: any) => {
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
                console.error('Google credential authentication failed:', err);
                setError(err?.message || 'Google authentication failed');
                setLoading(false);
              }
            },
            auto_select: false,
          });
        } catch (e) {
          console.warn('Error initializing Google ID services:', e);
        }
      }
    };

    if ((window as any).google?.accounts) {
      setupGoogleServices();
    } else {
      const script = document.getElementById('google-gsi-client');
      if (!script) {
        const newScript = document.createElement('script');
        newScript.id = 'google-gsi-client';
        newScript.src = 'https://accounts.google.com/gsi/client';
        newScript.async = true;
        newScript.defer = true;
        newScript.onload = () => setupGoogleServices();
        document.head.appendChild(newScript);
      } else {
        script.addEventListener('load', setupGoogleServices);
      }
    }
  }, [googleLogin, role, router]);

  // Handle click: Trigger Google pop-out window with list of accounts
  const handleGooglePopOutLogin = async () => {
    setLoading(true);
    setError('');

    // Method 1: Try Firebase signInWithPopup (uses authorized firebaseapp.com domain)
    try {
      console.log('Attempting Firebase Google sign-in pop-out...');
      const { auth, googleProvider } = getFirebase();
      if (auth && googleProvider) {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();
        await googleLogin({
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'Google User',
          credential: idToken,
          role,
        });
        router.push('/dashboard');
        return;
      }
    } catch (firebaseErr: any) {
      console.warn('Firebase popup notice:', firebaseErr);
      if (firebaseErr?.code === 'auth/popup-closed-by-user') {
        setLoading(false);
        return;
      }
      // If Firebase failed, fallback to GSI tokenClient
    }

    // Method 2: Google Identity Services OAuth Token Client pop-out with prompt: 'select_account'
    if (tokenClientRef.current) {
      try {
        console.log('Opening Google accounts pop-out window via GSI...');
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Failed to open GSI tokenClient pop-out:', err);
      }
    }

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              setLoading(false);
              if (tokenResponse.error !== 'access_denied') {
                setError(tokenResponse.error_description || tokenResponse.error);
              }
              return;
            }
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                if (profile?.email) {
                  await googleLogin({
                    email: profile.email,
                    name: profile.name || profile.email.split('@')[0],
                    role,
                  });
                  router.push('/dashboard');
                }
              } catch (err: any) {
                setError('Failed to fetch Google profile.');
                setLoading(false);
              }
            }
          },
        });
        tokenClientRef.current = client;
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {
        console.warn('OAuth2 client initialization notice:', e);
      }
    }

    setError('Could not open Google pop-out window. Please check your browser popup settings.');
    setLoading(false);
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* Google Pop-Out Account Chooser Button */}
      <button
        type="button"
        onClick={handleGooglePopOutLogin}
        disabled={loading}
        className="w-full h-[52px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-[18px] font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:border-slate-300 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
            <span>Connecting to Google...</span>
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

      {/* Inline Error Notice */}
      {error && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-semibold text-center mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
