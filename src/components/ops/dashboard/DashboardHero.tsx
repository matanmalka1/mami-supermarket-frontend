import React from "react";
import DashboardMetricCard from "@/components/ops/dashboard/DashboardMetricCard";
import { AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";

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
  <Card padding="md" className="rounded-3xl shadow-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 space-y-6">
    <div className="space-y-3">
      <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Orders Management</h1>
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 flex gap-2 items-center font-semibold">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
          {ordersCount} Active Orders
        </p>
        <span className="text-gray-300">•</span>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold">
          {pendingCount} Pending
        </p>
      </div>
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
  </Card>
);

export default DashboardHero;
