import React from "react";
import { Sparkles } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";

export const HeroSection: React.FC<{
  onStart: () => void;
  onExplore: () => void;
}> = ({ onStart, onExplore }) => (
  <section className="relative h-[650px] rounded-[4rem] overflow-hidden group shadow-2xl">
    <img
      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
      alt="Hero"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#0e2918]/95 to-transparent" />
    <div className="relative h-full flex flex-col justify-center px-20 max-w-3xl text-white space-y-10">
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-full w-fit">
        <Sparkles size={16} className="text-yellow-400" />
        <span className="text-[10px] uppercase tracking-[0.2em]">
          Freshness Guaranteed
        </span>
      </div>
      <h1 className="text-8xl leading-[0.95] tracking-tighter ">
        Purely Fresh. <br />
        <span className="text-emerald-300 ">Honestly Sourced.</span>
      </h1>
      <p className="text-xl font-medium opacity-80 max-w-lg leading-relaxed">
        Partnering with local organic farmers to bring the morning's harvest
        straight to your table.
      </p>
      <div className="flex gap-5">
        <Button
          variant="outline"
          size="xl"
          className="bg-white/30 text-[#0e2918] hover:bg-gray-100 border-white/20"
          onClick={onStart}
        >
          Start Shopping
        </Button>
        <Button
          variant="outline"
          size="xl"
          className="bg-white/30 text-[#0e2918] hover:bg-gray-100 border-white/20"
          onClick={onExplore}
        >
          Explore Farms
        </Button>
      </div>
    </div>
  </section>
);

export const BenefitCard: React.FC<{
  icon: any;
  title: string;
  desc: string;
  bg: string;
  color: string;
}> = ({ icon, title, desc, bg, color }) => (
  <Card
    variant="flat"
    padding="lg"
    className={`${bg}/50 flex flex-col items-center text-center space-y-6 group hover:scale-[1.02]`}
  >
    <div
      className={`w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center ${color} group-hover:rotate-12 transition-transform`}
    >
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h4 className="text-2xl text-gray-900 ">{title}</h4>
    <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
  </Card>
);
