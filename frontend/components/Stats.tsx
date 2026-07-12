'use client';

import { Users, Award, Clock, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const statsData = [
  { id: 'customers', target: 50, label: 'Happy Customers', suffix: 'K+', icon: Users },
  { id: 'mechanics', target: 2500, label: 'Verified Mechanics', suffix: '+', icon: Award },
  { id: 'response', target: 12, label: 'Avg. Response Time', suffix: ' min', icon: Clock },
  { id: 'rating', target: 4.9, label: 'Platform Rating', suffix: '★', icon: Star },
];

export default function Stats() {
  const [counts, setCounts] = useState({
    customers: 0,
    mechanics: 0,
    response: 30,
    rating: 1.0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounts({
        customers: Math.min(Math.round((50 / steps) * step), 50),
        mechanics: Math.min(Math.round((2500 / steps) * step), 2500),
        response: Math.max(Math.round(30 - ((30 - 12) / steps) * step), 12),
        rating: Number(Math.min(1.0 + ((4.9 - 1.0) / steps) * step, 4.9).toFixed(1)),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="fluid-container container-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            const currentVal = counts[stat.id as keyof typeof counts];
            return (
              <div
                key={stat.id}
                className="group relative bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 hover:shadow-md hover:border-slate-200 transition-all duration-300 w-full flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-6 w-full">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                    <Icon className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-black text-[#0B132B] tracking-tight">
                        {currentVal}
                      </span>
                      <span className="text-xl font-bold text-[#FF6B00] ml-0.5">
                        {stat.suffix}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
