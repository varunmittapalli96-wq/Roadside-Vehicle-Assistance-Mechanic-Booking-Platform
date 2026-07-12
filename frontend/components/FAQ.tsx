'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How is the service pricing calculated?',
    answer: 'We provide completely transparent upfront estimates. The base diagnostics fee is fixed at $49, and additional labor/materials fees are itemized on your screen before you confirm the booking. No surprises.',
  },
  {
    question: 'How fast will my matched mechanic arrive?',
    answer: 'On average, our dispatched technicians arrive within 12 to 15 minutes of booking confirmation. You can track their exact real-time GPS location and ETA on our app.',
  },
  {
    question: 'Can I cancel my request after matching?',
    answer: 'Yes. You can cancel your dispatch requests easily from your dashboard. However, a small cancellation charge may apply if the mechanic is already near your location.',
  },
  {
    question: 'What secure payment methods do you accept?',
    answer: 'RVAPro supports secure checkout options using credit/debit cards, UPI, netbanking, and digital wallets directly through our encrypted payment gateways.',
  },
  {
    question: 'Are the dispatch technicians verified?',
    answer: 'Yes, absolutely. Every partner mechanic and towing specialist undergoes rigorous professional testing, commercial insurance checks, and local government background validation before boarding.',
  },
  {
    question: 'Is using RVAPro safe on remote highways?',
    answer: 'We prioritize customer safety above all. The platform operates 24/7 with real-time support channels, GPS tracking shareable with friends/family, and verified mechanics carrying legal identification credentials.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="section-padding bg-white relative overflow-hidden">
      <div className="fluid-container container-padding max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-[#FF6B00] font-bold text-sm uppercase tracking-wider mb-3">Support Center</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B132B] tracking-tight mb-4">
            Frequently Asked <span className="text-[#FF6B00]">Questions</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Everything you need to know about pricing, arrival ETA, cancellation, payments, and platform safety guidelines.
          </p>
        </div>

        {/* FAQ Accordions Grid */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className={`bg-white border rounded-[24px] overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-[#FF6B00]/40 shadow-sm' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-colors"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
                    <span className="text-base sm:text-lg font-bold text-[#0B132B] tracking-tight">{faq.question}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isOpen ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Animated collapse content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-slate-100' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 sm:p-8 text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold bg-slate-50/50">
                    {faq.answer}
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
