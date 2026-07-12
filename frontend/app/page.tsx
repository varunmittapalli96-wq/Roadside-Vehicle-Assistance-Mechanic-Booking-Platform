'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import HowItWorks from '@/components/HowItWorks';
import LiveDemo from '@/components/LiveDemo';
import Features from '@/components/Features';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-700 font-sans selection:bg-[#FF6B00]/10 selection:text-[#FF6B00] relative">
      
      {/* Subtle Background Glow Shapes (no text pattern marquee) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#FF6B00]/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-slate-100 blur-[130px]" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <LiveDemo />
        <Features />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
