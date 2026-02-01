import React from "react";

type DashboardMetricCardProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: string;
  accent?: "emerald" | "amber" | "slate" | "sky";
  loading?: boolean;
};

const accentClass = (accent: DashboardMetricCardProps["accent"]) => {
  switch (accent) {
    case "amber":
      return "from-amber-400 to-amber-500 text-white";
    case "slate":
      return "from-slate-600 to-slate-800 text-white";
    case "sky":
      return "from-sky-400 to-sky-500 text-white";
    default:
      return "from-emerald-400 to-emerald-600 text-white";
  }
};

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  sub,
  accent = "emerald",
  loading = false,
}) => (
  <div
    className={`rounded-[2rem] p-6 bg-gradient-to-br shadow-2xl border border-white/20 animate-in fade-in duration-500 ${accentClass(accent)}`}
  >
    <p className="text-[10px] uppercase tracking-[0.4em] opacity-80">{label}</p>
    <h3 className="text-3xl md:text-4xl  mt-2">
      {loading ? "—" : value}
    </h3>
    {sub && <p className="text-[11px] mt-1 opacity-80">{sub}</p>}
  </div>
);

export default DashboardMetricCard;
