'use client';

import { PhoneCall, Users, MapPin } from 'lucide-react';

const stepsData = [
  {
    step: '01',
    title: 'Request Assistance',
    desc: 'Enter your breakdown details and location directly on your screen.',
    icon: PhoneCall,
  },
  {
    step: '02',
    title: 'Match With Mechanic',
    desc: 'Our automated system matches you with the closest certified responder.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Track Arrival Live',
    desc: 'Monitor the technician\'s real-time GPS location coordinates as they approach.',
    icon: MapPin,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white relative overflow-hidden">
      <div className="fluid-container container-padding">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="inline-block text-[#FF6B00] font-bold text-sm uppercase tracking-wider mb-3">Workflow</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-4">
            How It Works in <span className="text-[#FF6B00]">3 Steps</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            A fast and streamlined matching process designed to get you roadside help as quickly as possible.
          </p>
        </div>

        {/* Timeline Matching Grid */}
        <div className="relative">
          {/* Thin grey connector line */}
          <div className="hidden lg:block absolute top-[68px] 3xl:top-[80px] left-[15%] right-[15%] h-[1px] bg-slate-200" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {stepsData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="group relative text-center flex flex-col items-center">
                  
                  {/* Step outline bubble & icon */}
                  <div className="relative z-10 mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-[#FF6B00]/20 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-[#FF6B00] transition-all duration-300">
                      <Icon className="w-8 h-8 text-[#FF6B00] stroke-[1.5]" />
                    </div>
                    {/* Minimal number badge */}
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#FF6B00] text-white font-bold text-xs flex items-center justify-center border-2 border-white">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B132B] tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed font-semibold">
                    {item.desc}
                  </p>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
