'use client';

import { useState } from 'react';
import { ShieldCheck, MapPin, CreditCard, Sparkles, Navigation, CheckCircle2, Car } from 'lucide-react';

export default function LiveDemo() {
  const [activeTab, setActiveTab] = useState<'book' | 'track' | 'pay'>('book');

  return (
    <section className="section-padding bg-slate-50 border-y border-slate-100 relative overflow-hidden">
      <div className="fluid-container container-padding">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-[#FF6B00] font-bold text-sm uppercase tracking-wider mb-3">Live Experience</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-4">
            Interactive Platform <span className="text-[#FF6B00]">Showcase</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Explore the simplified user dashboard flow. Tap the tabs below to simulate ordering, dispatching, and paying for assistance.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center bg-white border border-slate-100 rounded-[32px] p-6 lg:p-12 shadow-sm relative">
          
          {/* Left Control tabs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {[
              { id: 'book', title: '1. Book Assistance', desc: 'Pinpoint your current location, choose service details, and submit.', icon: MapPin },
              { id: 'track', title: '2. Track Dispatch', desc: 'Monitor your matched technician live on a mapping grid.', icon: Navigation },
              { id: 'pay', title: '3. Complete Securely', desc: 'Verify work completed and pay digital receipts.', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-left p-6 rounded-[20px] border transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-50 border-slate-200 shadow-sm -translate-y-0.5'
                      : 'bg-transparent border-transparent hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#FF6B00] text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-base font-black tracking-tight ${isActive ? 'text-[#0B132B]' : 'text-slate-700'}`}>
                      {tab.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold pl-14">{tab.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Right Preview Card Mockup (7 cols) */}
          <div className="lg:col-span-7 flex justify-center w-full">
            <div className="w-full max-w-[500px] sm:max-w-[550px] bg-slate-50 border border-slate-200/60 rounded-[28px] p-6 sm:p-8 shadow-md relative min-h-[420px] flex flex-col justify-between">
              
              {/* Tab Content: Book */}
              {activeTab === 'book' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/40">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">New Booking Request</span>
                    <span className="text-[10px] font-bold text-[#FF6B00] bg-[#FF6B00]/5 px-2.5 py-1 rounded-md">Step 1 of 3</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Your Location</label>
                      <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                        <MapPin className="w-5 h-5 text-[#FF6B00] flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">NH-48 Highway, Kilometer 45, Gurugram</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">Service Type</label>
                      <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                        <Car className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">Flat Tire replacement & diagnostic</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-2xl p-4 flex gap-3.5">
                    <Sparkles className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Instant Match Guarantee</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1 leading-normal">Our algorithms will locate and assign the nearest mechanic immediately.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('track')}
                    className="w-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold h-14 px-8 rounded-2xl text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Locate Nearest Mechanic
                  </button>
                </div>
              )}

              {/* Tab Content: Track */}
              {activeTab === 'track' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/40">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Tracking Dispatched Mechanic</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Step 2 of 3</span>
                  </div>

                  <div className="relative h-36 sm:h-44 bg-white rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-[0.1]"
                      style={{
                        backgroundImage: `linear-gradient(to right, #6b7280 1px, transparent 1px), linear-gradient(to bottom, #6b7280 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <div className="absolute left-10 top-10 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute right-10 bottom-10 w-6 h-6 bg-[#FF6B00] rounded-full border-2 border-white shadow-md animate-bounce flex items-center justify-center">
                      <Navigation className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-100 shadow-sm rounded-lg px-2.5 py-1.5 z-10">Route distance: 0.9 miles</span>
                  </div>

                  <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">RK</div>
                      <div>
                        <h5 className="text-[11px] sm:text-xs font-black text-gray-900">Rajesh Kumar</h5>
                        <p className="text-[9px] text-gray-400 font-bold">4.9 ★ verified partner</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-gray-900">Arrives in 4 mins</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('pay')}
                    className="w-full bg-[#0B132B] hover:bg-slate-800 text-white font-bold h-14 px-8 rounded-2xl text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Mark Job Completed
                  </button>
                </div>
              )}

              {/* Tab Content: Pay */}
              {activeTab === 'pay' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/40">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Receipt & Payment</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Step 3 of 3</span>
                  </div>

                  <div className="text-center py-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-gray-900">Service Finished Successfully</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">Vehicle Flat Tire repaired and inspected</p>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-600 space-y-2.5 shadow-sm">
                    <div className="flex justify-between">
                      <span>Service Diagnostics</span>
                      <span>$49.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Site Labor</span>
                      <span>$20.00</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-2.5 text-gray-900 font-black">
                      <span>Total Invoice</span>
                      <span className="text-[#FF6B00]">$69.00</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('book')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-8 rounded-2xl text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Done - Back to Dashboard
                  </button>
                </div>
              )}

              {/* Status info bar */}
              <div className="border-t border-slate-200/40 pt-4 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>RVAPro Mobile Demo</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Secure SSL Connection
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
