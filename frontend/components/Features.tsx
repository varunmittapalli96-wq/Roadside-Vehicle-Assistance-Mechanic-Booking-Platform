'use client';

import {
  Compass,
  ShieldCheck,
  IndianRupee,
  Clock,
  CreditCard,
} from 'lucide-react';

export default function Features() {
  return (
    <section id="why-us" className="section-padding bg-white relative overflow-hidden">
      <div className="fluid-container container-padding">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-[#FF6B00] font-bold text-sm uppercase tracking-wider mb-3">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-4">
            Built for Speed, Safety & <span className="text-[#FF6B00]">Trust</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            We are redefining roadside vehicle assistance with modern tech and certified mechanics. Here is why drivers trust RVAPro.
          </p>
        </div>

        {/* Bento Grid: White cards, simple borders, orange outline icons */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 xl:gap-8">
          
          {/* Card 1: GPS Live Tracking */}
          <div className="md:col-span-3 bg-white border border-slate-100 rounded-[24px] p-8 sm:p-10 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#FF6B00]/30 transition-all duration-300 relative overflow-hidden group min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF6B00] mb-6 group-hover:scale-105 transition-transform duration-300">
                <Compass className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] tracking-tight mb-2">Real-Time GPS Live Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                No more guessing. Watch your dispatched mechanic move on an interactive live map directly from your mobile dashboard.
              </p>
            </div>
          </div>

          {/* Card 2: Verified Partners */}
          <div className="md:col-span-3 bg-white border border-slate-100 rounded-[24px] p-8 sm:p-10 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#FF6B00]/30 transition-all duration-300 relative overflow-hidden group min-h-[260px]">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF6B00] mb-6 group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] tracking-tight mb-2">100% Certified Mechanics</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                All tow operators and mechanics undergo background, licensing, and professional credential checks before taking calls.
              </p>
            </div>
          </div>

          {/* Card 3: Transparent Pricing */}
          <div className="md:col-span-2 bg-white border border-slate-100 rounded-[24px] p-8 sm:p-10 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#FF6B00]/30 transition-all duration-300 relative overflow-hidden group min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF6B00] mb-6 group-hover:scale-105 transition-transform duration-300">
                <IndianRupee className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] tracking-tight mb-2">Transparent Pricing</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Know full service estimates before booking. No surprise bills or hidden fees.
              </p>
            </div>
          </div>

          {/* Card 4: Fast Response */}
          <div className="md:col-span-2 bg-white border border-slate-100 rounded-[24px] p-8 sm:p-10 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#FF6B00]/30 transition-all duration-300 relative overflow-hidden group min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF6B00] mb-6 group-hover:scale-105 transition-transform duration-300">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] tracking-tight mb-2">Fast 12-Min Response</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Our smart dispatch routing automatically guides the closest tech to your location.
              </p>
            </div>
          </div>

          {/* Card 5: Secure Payments */}
          <div className="md:col-span-2 bg-white border border-slate-100 rounded-[24px] p-8 sm:p-10 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#FF6B00]/30 transition-all duration-300 relative overflow-hidden group min-h-[220px]">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF6B00] mb-6 group-hover:scale-105 transition-transform duration-300">
                <CreditCard className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B132B] tracking-tight mb-2">Secure Payments</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                Pay securely using credit cards, UPI, or digital wallets directly in the app.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
