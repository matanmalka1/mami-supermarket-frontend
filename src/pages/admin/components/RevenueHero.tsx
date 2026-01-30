import React from "react";
import { ShieldCheck } from "lucide-react";

type RevenueHeroProps = {
  detail: string;
  hasData: boolean;
};

const RevenueHero: React.FC<RevenueHeroProps> = ({ detail, hasData }) => (
  <div className="bg-emerald-950 rounded-[3rem] p-10 text-white flex items-center gap-8 shadow-2xl relative overflow-hidden">
    <div className="absolute right-0 top-0 p-10 opacity-10">
      <ShieldCheck size={160} />
    </div>
    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl shrink-0 border border-white/20">
      <ShieldCheck size={40} className="text-emerald-400" />
    </div>
    <div className="space-y-2">
      <h4 className="text-[10px] uppercase tracking-[0.4em] text-emerald-400">
        Revenue Trend
      </h4>
      <p className="text-2xl font-bold  pr-20 leading-tight">{detail}</p>
      <p className="text-sm font-semibold opacity-70">
        {hasData
          ? "Live series refreshed from backend data."
          : "Awaiting revenue metrics..."}
      </p>
    </div>
  </div>
);

export default RevenueHero;
