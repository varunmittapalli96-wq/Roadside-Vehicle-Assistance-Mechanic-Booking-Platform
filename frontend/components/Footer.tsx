'use client';

import Link from 'next/link';
import { Wrench, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 overflow-hidden">
      <div className="fluid-container container-padding">
        
        {/* Top footer row with grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column (Col 1) */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/10">
                <Wrench className="w-5.5 h-5.5 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                RVA<span className="text-[#FF6B00]">Pro</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              We connect drivers with verified nearby mechanics instantly. Fast, professional, and transparent 24/7 roadside assistance at your fingertips.
            </p>
          </div>

          {/* Links Column: Services (Col 2) */}
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-5">Services</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold text-slate-400">
              <li><Link href="/register" className="hover:text-[#FF6B00] transition-colors">Towing</Link></li>
              <li><Link href="/register" className="hover:text-[#FF6B00] transition-colors">Flat Tire</Link></li>
              <li><Link href="/register" className="hover:text-[#FF6B00] transition-colors">Jump-Start</Link></li>
              <li><Link href="/register" className="hover:text-[#FF6B00] transition-colors">Diagnostics</Link></li>
              <li><Link href="/register" className="hover:text-[#FF6B00] transition-colors">Fuel Delivery</Link></li>
            </ul>
          </div>

          {/* Links Column: Company (Col 3) */}
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold text-slate-400">
              <li><Link href="#why-us" className="hover:text-[#FF6B00] transition-colors">About Us</Link></li>
              <li><Link href="/register?role=mechanic" className="hover:text-[#FF6B00] transition-colors">Partners</Link></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Safety Board</a></li>
            </ul>
          </div>

          {/* Links Column: Support (Col 4) */}
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-5">Support</h4>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold text-slate-400">
              <li><Link href="#faq" className="hover:text-[#FF6B00] transition-colors">Help Center</Link></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">API Devs</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Status Board</a></li>
            </ul>
          </div>

          {/* Newsletter Column (Col 5) */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Newsletter</h4>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              Get road safety tips, updates, and direct notifications from RVAPro.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-gray-950 placeholder-slate-400 bg-white border border-slate-200 rounded-2xl pl-4 pr-12 py-3.5 outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 bg-[#FF6B00] hover:bg-[#e05e00] rounded-xl text-white shadow transition-all"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] sm:text-xs font-bold text-emerald-600 animate-fadeIn">✓ Subscribed successfully!</p>
            )}
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-slate-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            &copy; 2026 RVAPro. Unified Mentor Project. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs sm:text-sm font-semibold text-slate-400">
            <a href="#" className="hover:text-[#FF6B00] transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-[#FF6B00] transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-[#FF6B00] transition-colors">Legal Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
