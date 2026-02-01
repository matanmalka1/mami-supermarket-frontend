import React from "react";
import { Package } from "lucide-react";

const PickingGuidanceCard: React.FC = () => (
  <div className="bg-teal-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
    <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
      <Package size={120} />
    </div>
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
        <Package size={32} className="text-teal-300" />
      </div>
      <div className="space-y-1">
        <h4 className="text-[10px] uppercase tracking-[0.3em] text-teal-300">
          Operational Guidance
        </h4>
        <p className="text-xl font-bold  pr-20 leading-tight">
          Please follow the bin sequence for maximum efficiency.
        </p>
      </div>
    </div>
  </div>
);

export default PickingGuidanceCard;
