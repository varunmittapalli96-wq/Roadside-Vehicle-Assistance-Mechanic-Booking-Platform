'use client';

import Link from 'next/link';
import { ArrowRight, Phone, ShieldCheck, Zap } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-[#F8FAFC] border-t border-slate-100 relative overflow-hidden">
      <div className="fluid-container container-padding">
        
        {/* Main CTA banner card - Clean white card styling with subtle orange glows */}
        <div className="relative bg-white border border-slate-200/80 rounded-[36px] px-8 py-20 md:p-24 text-center overflow-hidden shadow-sm hover:border-[#FF6B00]/30 transition-colors duration-300">
          
          {/* Subtle overlay elements */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #FF6B00 2px, transparent 2px)`,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FF6B00]/[0.02] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF6B00]/[0.02] rounded-full blur-3xl pointer-events-none" />

          {/* Floating abstract badge */}
          <div className="relative z-10 inline-flex items-center gap-2 bg-[#FF6B00]/5 border border-[#FF6B00]/15 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#FF6B00] mb-8">
            <Zap className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]" />
            24/7 Availability — Quick Local Dispatches
          </div>

          {/* Headline */}
          <h2 className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-8 max-w-4xl mx-auto leading-[1.08] text-[#0B132B]">
            Stranded on the Road? <br />
            <span className="text-[#FF6B00]">Get Assistance in Under 15 Minutes.</span>
          </h2>

          {/* Subtext */}
          <p className="relative z-10 text-slate-500 text-sm sm:text-base font-semibold max-w-xl mx-auto mb-12 leading-relaxed">
            No registration fees. Enter your location, pick a service, and connect with a certified vehicle assistance technician immediately.
          </p>

          {/* Action buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-md mx-auto sm:max-w-none">
            <Link
              href="/register"
              className="group flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-16 px-10 rounded-2xl text-base shadow-xl shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-300"
            >
              Request Assistance Now
              <ArrowRight className="w-5.5 h-5.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register?role=mechanic"
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0B132B] font-extrabold h-16 px-10 rounded-2xl text-base transition-all duration-300 border border-slate-200 hover:-translate-y-0.5"
            >
              <Phone className="w-5.5 h-5.5" />
              Become Service Partner
            </Link>
          </div>

          {/* Security stamp */}
          <div className="relative z-10 mt-10 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-400">
            <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
            Secure checkout & verified assistance
          </div>

        </div>

      </div>
    </section>
  );
}
