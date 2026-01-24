import React from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../ui/Button';

export const HeroSection: React.FC<{ onStart: () => void; onExplore: () => void }> = ({ onStart, onExplore }) => (
  <section className="relative h-[650px] rounded-[4rem] overflow-hidden group shadow-2xl">
    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Hero" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#1A4D2E]/95 to-transparent" />
    <div className="relative h-full flex flex-col justify-center px-20 max-w-3xl text-white space-y-10">
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-full w-fit">
        <Sparkles size={16} className="text-yellow-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Freshness Guaranteed</span>
      </div>
      <h1 className="text-8xl font-black leading-[0.95] tracking-tighter italic">Purely Fresh. <br/><span className="text-emerald-300 not-italic">Honestly Sourced.</span></h1>
      <p className="text-xl font-medium opacity-80 max-w-lg leading-relaxed">Partnering with local organic farmers to bring the morning's harvest straight to your table.</p>
      <div className="flex gap-5">
        <Button variant="ghost" size="xl" className="bg-white text-[#1A4D2E] hover:bg-gray-100" onClick={onStart}>Start Shopping</Button>
        <Button variant="outline" size="xl" className="bg-white/10 text-white hover:bg-white/20 border-white/20" onClick={onExplore}>Explore Farms</Button>
      </div>
    </div>
  </section>
);

export const BenefitCard: React.FC<{ icon: any, title: string, desc: string, bg: string, color: string }> = ({ icon, title, desc, bg, color }) => (
  <div className={`p-12 ${bg}/50 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center space-y-6 group hover:scale-[1.02] transition-all`}>
    <div className={`w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center ${color} group-hover:rotate-12 transition-transform`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h4 className="font-black text-2xl text-gray-900 italic">{title}</h4>
    <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
  </div>
);