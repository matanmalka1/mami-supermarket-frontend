import React from "react";
import DashboardMetricCard from "@/components/ops/dashboard/DashboardMetricCard";
import { AlertTriangle } from "lucide-react";

type DashboardHeroProps = {
  ordersCount: number;
  pendingCount: number;
  expressDue: number;
  metricSubtitle: string;
  batchEfficiency?: string | number;
  livePickers?: string | number;
  perfLoading: boolean;
  urgentCount: number;
};

const DashboardHero: React.FC<DashboardHeroProps> = ({
  ordersCount,
  pendingCount,
  expressDue,
  metricSubtitle,
  batchEfficiency,
  livePickers,
  perfLoading,
  urgentCount,
}) => (
  <div className="rounded-[3rem] bg-white border border-gray-100 p-8 shadow-2xl space-y-6">
    <div className="space-y-2">
      <h1 className="text-4xl  tracking-tight">Orders Management</h1>
      <p className="text-xs uppercase tracking-[0.4em] text-gray-400 flex gap-2 items-center">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        {ordersCount} Active Orders • {pendingCount} Pending
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DashboardMetricCard
        label="Batch Efficiency"
        value={batchEfficiency ?? "—"}
        sub={metricSubtitle}
        accent="slate"
        loading={perfLoading}
      />
      <DashboardMetricCard
        label="Live Pickers"
        value={livePickers ?? "—"}
        sub="Realtime floor visibility"
        accent="sky"
        loading={perfLoading}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardMetricCard
        label="Total Pending"
        value={pendingCount}
        sub="Orders awaiting pick"
        accent="emerald"
      />
      <DashboardMetricCard
        label="Express Critical"
        value={expressDue}
        sub="Immediate action"
        accent="amber"
      />
      <DashboardMetricCard
        label={
          <span className="flex items-center gap-2">
            <AlertTriangle size={14} />
            Urgent Exceptions
          </span>
        }
        value={urgentCount ?? "—"}
        sub="Requires immediate review"
        accent="slate"
      />
    </div>
  </div>
);

export default DashboardHero;
