'use client';

export default function TrustSection() {
  const brands = [
    'Toyota',
    'Honda',
    'Hyundai',
    'Suzuki',
    'Kia',
    'Mahindra',
    'Tata',
    'BMW',
    'Mercedes',
    'Audi',
  ];

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="fluid-container container-padding">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Trust Text */}
          <div className="flex items-center gap-4 flex-shrink-0 text-center lg:text-left">
            <span className="text-3xl sm:text-4xl font-black text-[#0B132B] tracking-tight">100,000+</span>
            <div className="h-10 w-[1px] bg-slate-200 hidden sm:block" />
            <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider">
              Stranded Drivers Assisted & Supported
            </p>
          </div>

          {/* Brands logo scroll */}
          <div className="w-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />

            <div className="flex items-center justify-center lg:justify-between flex-wrap sm:flex-nowrap gap-8 sm:gap-12 overflow-x-auto no-scrollbar py-2">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="text-slate-400 hover:text-[#0B132B] font-black text-lg sm:text-2xl tracking-tight transition-colors duration-200 select-none flex-shrink-0 cursor-default"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
