'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Wrench, Menu, X, Zap, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dashboardLink =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'mechanic'
        ? '/dashboard/mechanic'
        : '/dashboard/user';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 border-b border-slate-100 shadow-sm py-4'
          : 'bg-white border-b border-transparent py-5'
      }`}
    >
      <div className="fluid-container container-padding">
        <div className="flex items-center justify-between">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300">
                <Wrench className="w-5.5 h-5.5 text-white" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight block">
                  RVA <span className="text-[#FF6B00]">Pro</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wide block -mt-0.5">
                  24/7 Vehicle Assistance
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 xl:gap-10">
            {['Services', 'How It Works', 'Why Us', 'Testimonials', 'FAQ'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm sm:text-base font-semibold text-slate-600 hover:text-[#FF6B00] transition-colors py-2"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* User Dashboard Button */}
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#FF6B00] bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-3.5 py-2 rounded-xl transition-all shadow-xs group"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center text-xs font-black shadow-xs group-hover:scale-105 transition-transform">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>Dashboard ({user.name?.split(' ')[0] || 'User'})</span>
                </Link>

                {/* Always-accessible Sign In / Switch button */}
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#FF6B00] px-3 py-2 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-colors"
                  title="Sign in with another account"
                >
                  Sign In
                </Link>

                {/* Instant Log Out button */}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                  }}
                  className="text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                  title="Log out of current account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm sm:text-base font-bold text-[#0B132B] hover:text-[#FF6B00] px-4 py-2.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold shadow-sm"
                >
                  Get Help Now
                  <Zap className="w-4 h-4 text-white" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-5 py-6 space-y-4">
          {['Services', 'How It Works', 'Why Us', 'Testimonials', 'FAQ'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-slate-700 hover:text-[#FF6B00] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all"
            >
              {link}
            </a>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="px-3 py-2 bg-orange-50/70 border border-orange-200/60 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Logged in as: <strong className="text-[#FF6B00]">{user.name}</strong></span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-black">{user.role}</span>
                </div>
                <Link
                  href={dashboardLink}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 py-3 rounded-xl transition-all block border border-slate-200/80"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-all block"
                >
                  Sign In with Different Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center font-bold text-white bg-red-600 hover:bg-red-700 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-semibold text-slate-700 hover:text-[#FF6B00] py-3 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center font-semibold text-white bg-[#FF6B00] hover:bg-[#e05e00] py-3.5 rounded-xl transition-colors shadow-md shadow-orange-500/10"
                >
                  Get Help Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
