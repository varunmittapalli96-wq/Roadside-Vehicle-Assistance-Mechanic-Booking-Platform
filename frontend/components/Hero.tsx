'use client';

import Link from 'next/link';
import { ArrowRight, HeartHandshake, CheckCircle2, Car, Navigation, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [seconds, setSeconds] = useState(480);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 10 ? prev - 1 : 480));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="relative min-h-screen md:min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-white pt-32 pb-24">
      {/* Light gradient glow shapes in background */}
      <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#FF6B00]/5 to-slate-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] bg-gradient-to-tr from-slate-100/50 to-orange-50/20 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative fluid-container container-padding w-full h-full flex items-center">
        {/* Split Hero layout: Left text, Right premium live dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 xl:gap-24 3xl:gap-32 items-center w-full">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-6 flex flex-col items-start w-full">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/5 border border-[#FF6B00]/15 rounded-full px-4.5 py-2 text-xs sm:text-sm font-bold text-[#FF6B00] mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
              </span>
              24/7 Emergency Dispatch Operational
            </div>

            {/* Headline */}
            <h1 className="hero-title mb-6 text-[#0B132B]">
              Stranded? <br />
              <span className="text-[#FF6B00]">
                Help is only minutes away.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="hero-text mb-10 max-w-xl text-slate-500">
              Connect instantly with certified mechanics for breakdown repairs, professional towing, jump-starts, and emergency fuel delivery. Real-time GPS tracking with 100% upfront pricing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 w-full sm:w-auto">
              <Link
                href="/register"
                className="group btn-primary text-base sm:text-lg w-full sm:w-auto text-center"
              >
                Request Assistance
                <ArrowRight className="w-5 h-5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register?role=mechanic"
                className="btn-secondary text-base sm:text-lg w-full sm:w-auto text-center"
              >
                <HeartHandshake className="w-5 h-5 mr-1.5 text-[#FF6B00]" />
                Become Partner
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-slate-100 pt-8 w-full">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Enterprise Safety & Dispatch Standards</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                {[
                  { text: 'Verified Mechanics' },
                  { text: 'Transparent Pricing' },
                  { text: '24/7 Support Desk' },
                  { text: 'No Hidden Charges' },
                  { text: '100% Secure Bookings' },
                  { text: '4.9★ Customer Rating' },
                ].map(({ text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B132B]">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#FF6B00] flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Premium Dashboard Live Dispatch Mockup Card */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[550px] bg-slate-50/70 border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
              
              {/* Card Header Status */}
              <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center text-[#FF6B00]">
                    <Navigation className="w-5.5 h-5.5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#0B132B] leading-none">Mechanic Dispatch</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live GPS Tracking Active
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-700 text-xs sm:text-sm px-3.5 py-1.5 rounded-full font-bold border border-emerald-100">
                  En Route
                </div>
              </div>

              {/* Map Illustration Area */}
              <div className="relative bg-white border border-slate-100 rounded-2xl h-52 sm:h-60 overflow-hidden mb-5 shadow-inner">
                <div className="absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage: `linear-gradient(to right, #6b7280 1px, transparent 1px), linear-gradient(to bottom, #6b7280 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }}
                />
                
                {/* Simulated roads */}
                <svg className="absolute inset-0 w-full h-full text-slate-100" fill="none">
                  <path d="M -20,110 L 820,110" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
                  <path d="M 120,-20 L 120,420" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
                  <path d="M 380,-20 L 380,420" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
                  <path d="M 120,60 Q 240,90 380,147" stroke="#FF6B00" strokeWidth="3" strokeDasharray="6 4" />
                </svg>

                {/* Customer Pin */}
                <div className="absolute top-[60px] left-[120px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow mb-1">
                    Your SUV
                  </span>
                  <div className="w-4.5 h-4.5 bg-blue-600 rounded-full border-2 border-white shadow-md" />
                </div>

                {/* Mechanic Pin */}
                <div className="absolute top-[147px] left-[380px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                  <span className="bg-[#FF6B00] text-white font-bold text-[9px] px-2 py-0.5 rounded shadow mb-1">
                    RVA Mechanic
                  </span>
                  <div className="w-7 h-7 bg-[#FF6B00] rounded-full border-2 border-white shadow-md flex items-center justify-center">
                    <Car className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Arrival details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Estimated Arrival</span>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{formatTime(seconds)}</span>
                    <span className="text-xs text-slate-500 font-semibold">min</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Assistance Type</span>
                  <div className="text-xs sm:text-sm font-extrabold text-[#FF6B00] mt-1.5 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />
                    Flat Tire Repair
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
