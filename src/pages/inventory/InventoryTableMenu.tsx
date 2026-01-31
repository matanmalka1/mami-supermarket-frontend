import React from "react";
import { Move, Archive, BarChart2 } from "lucide-react";

interface InventoryTableMenuProps {
  inv: any;
  onMenuToggle: (id: number | null) => void;
  onViewAnalytics: (row: any) => void;
  onViewRelocation: (row: any) => void;
}

const InventoryTableMenu: React.FC<InventoryTableMenuProps> = ({
  inv,
  onMenuToggle,
  onViewAnalytics,
  onViewRelocation,
}) => (
  <div className="absolute right-8 top-16 w-56 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[70] p-2 animate-in zoom-in-95">
    <button
      onClick={() => {
        onViewRelocation(inv);
        onMenuToggle(null);
      }}
      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs"
    >
      <Move size={14} className="text-[#006666]" /> Relocate SKU
    </button>
    <button
      onClick={() => {
        onViewAnalytics(inv);
        onMenuToggle(null);
      }}
      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs"
    >
      <BarChart2 size={14} className="text-blue-500" /> Item Analytics
    </button>
    <div className="h-px bg-gray-50 my-1" />
    <button
      onClick={() => onMenuToggle(null)}
      className="w-full text-left p-3 rounded-xl hover:bg-red-50 hover:text-red-500 flex items-center gap-3 transition-colors text-xs"
    >
      <Archive size={14} className="text-red-400" /> Archive SKU
    </button>
  </div>
);

export default InventoryTableMenu;
