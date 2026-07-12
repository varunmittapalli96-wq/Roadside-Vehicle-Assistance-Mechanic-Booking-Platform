'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    text: 'My car broke down on the highway at night. Within 12 minutes a certified mechanic was at my location. Absolutely life-saving service!',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Rahul Verma',
    role: 'Business Owner',
    text: 'The transparent pricing and live tracking gave me full peace of mind. No hidden charges, no surprises. Professional service from start to finish.',
    rating: 5,
    avatar: 'RV',
  },
  {
    name: 'Anita Krishnan',
    role: 'Medical Professional',
    text: 'As someone who travels long distances regularly, having this app is like having a safety net. Quick, reliable, and trustworthy every single time.',
    rating: 5,
    avatar: 'AK',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-[#F8FAFC] border-y border-slate-100 relative overflow-hidden">
      <div className="fluid-container container-padding">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-[#FF6B00] font-bold text-sm uppercase tracking-wider mb-3">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-4">
            Trusted by <span className="text-[#FF6B00]">100,000+</span> Drivers
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Real reviews from real stranded drivers who used RVAPro for emergency road assistance.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {testimonials.map((item) => (
            <div key={item.name} className="w-full flex">
              <div className="bg-white border border-slate-100 rounded-[24px] p-8 sm:p-10 shadow-sm hover:shadow-md hover:border-[#FF6B00]/30 transition-all duration-300 flex flex-col justify-between w-full min-h-[260px]">
                
                <div>
                  {/* Quote icon outline */}
                  <div className="text-[#FF6B00] mb-6">
                    <Quote className="w-8 h-8 stroke-[1.5]" />
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed italic mb-8">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                {/* Customer Info row */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#0B132B] leading-none">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-bold mt-1">{item.role}</p>
                    </div>
                  </div>
                  
                  {/* Star ratings */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
