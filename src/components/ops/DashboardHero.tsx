import React from "react";
import DashboardMetricCard from "@/components/ops/DashboardMetricCard";
import Button from "@/components/ui/Button";
import { Layers, Play, AlertTriangle } from "lucide-react";

type DashboardHeroProps = {
  ordersCount: number;
  pendingCount: number;
  expressDue: number;
  selectedCount: number;
  onStartBatch: () => void;
  onViewBoard: () => void;
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
  selectedCount,
  onStartBatch,
  onViewBoard,
  metricSubtitle,
  batchEfficiency,
  livePickers,
  perfLoading,
  urgentCount,
}) => (
  <div className="rounded-[3rem] bg-white border border-gray-100 p-8 shadow-2xl space-y-6">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-4xl font-black  tracking-tight">Orders Management</h1>
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400 flex gap-2 items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          {ordersCount} Active Orders • {pendingCount} Pending
        </p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {selectedCount > 0 ? (
          <Button
            variant="emerald"
            className="rounded-2xl h-14 px-8 shadow-xl animate-in slide-in-from-right-4 flex items-center gap-3"
            icon={<Layers size={20} />}
            onClick={onStartBatch}
          >
            Start Batch Pick ({selectedCount})
            <Play size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="rounded-2xl h-12 px-6 border border-gray-200 text-gray-700"
            onClick={onViewBoard}
          >
            View Picking Board
          </Button>
        )}
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
  </div>
);

export default DashboardHero;
