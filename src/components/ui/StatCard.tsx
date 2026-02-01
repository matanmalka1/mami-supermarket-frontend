import React from "react";
import { Loader2 } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  sub?: string;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  sub,
  loading,
  onClick,
  className = "",
}) => (
  <div
    onClick={onClick}
    className={`bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all ${
      onClick
        ? "cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-95"
        : ""
    } ${className}`}
  >
    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4">
      {label}
    </p>

    {loading ? (
      <div className="py-2">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    ) : (
      <div className="space-y-1">
        <div className="flex items-end gap-3">
          <h3 className="text-3xl  tracking-tighter text-gray-900">{value}</h3>
          {trend && (
            <span
              className={`text-[10px] uppercase tracking-widest mb-1.5 ${
                trend.startsWith("+") ? "text-red-500" : "text-emerald-500"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
        {sub && <p className="text-xs font-bold text-gray-400 ">{sub}</p>}
      </div>
    )}
  </div>
);

export default StatCard;
