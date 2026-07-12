'use client';

import { Wrench, Truck, Battery, CircleDot, Fuel, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const servicesData = [
  {
    icon: Wrench,
    title: 'Breakdown Repair',
    desc: 'On-site diagnostics and professional vehicle repairs by certified technicians.',
  },
  {
    icon: Truck,
    title: 'Vehicle Towing',
    desc: 'Safe and secure flatbed vehicle towing services directly to your local garage.',
  },
  {
    icon: Battery,
    title: 'Battery Jump-Start',
    desc: 'Quick battery boost jump-start or on-spot battery replacement options.',
  },
  {
    icon: CircleDot,
    title: 'Flat Tire Repair',
    desc: 'Emergency tire replacement using your spare, or local puncture repair.',
  },
  {
    icon: Fuel,
    title: 'Fuel Delivery',
    desc: 'On-road emergency fuel dispatch delivered straight to your exact coordinates.',
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-[#F8FAFC] border-y border-slate-100 relative overflow-hidden">
      <div className="fluid-container container-padding">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-[#FF6B00] font-bold text-sm uppercase tracking-wider mb-3">Our Services</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-4">
            Reliable Roadside <span className="text-[#FF6B00]">Assistance</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Professional solutions for every breakdown. Connect instantly with local towing partners and mechanics near you.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-white border border-slate-100 rounded-[24px] p-8 hover:shadow-md hover:border-[#FF6B00]/40 transition-all duration-300 flex flex-col justify-between min-h-[280px]"
              >
                <div>
                  {/* Clean outline orange icon with transparent background */}
                  <div className="w-12 h-12 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FF6B00] mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B132B] tracking-tight mb-3">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-6">
                  {/* Action Link - Minimal Outline Chevron */}
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00] uppercase tracking-wider group-hover:gap-2 transition-all"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
