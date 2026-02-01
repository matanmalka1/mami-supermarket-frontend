import React from "react";
import { Info, RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { useOpsPerformance } from "@/features/ops/hooks/useOpsPerformance";
import { getSummaryCards } from "./staff-performance/config";

const StaffPerformance: React.FC = () => {
  const { metrics, loading, error, refresh } = useOpsPerformance();
  const showFallback = !metrics && (loading || error);
  const summaryCards = getSummaryCards(metrics);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex items-end justify-between border-b pb-8">
        <div>
          <h1 className="text-5xl  text-gray-900 tracking-tighter">
            Performance Hub
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
            Operational Analytics
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={refresh}
          disabled={loading}
          className="text-[11px] tracking-widest uppercase"
        >
          <RefreshCcw size={16} className="mr-2" /> Refresh Metrics
        </Button>
      </div>

      {error && !metrics && (
        <EmptyState
          title="Performance metrics unavailable"
          description={error}
          action={
            <Button onClick={refresh} variant="brand" disabled={loading}>
              Retry
            </Button>
          }
        />
      )}

      {showFallback && !metrics ? (
        <LoadingState label="Loading performance metrics..." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              sub={card.sub}
              loading={loading && !metrics}
            />
          ))}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
              Operational pulse
            </p>
            <p className="text-sm font-bold text-gray-500 max-w-3xl">
              Metrics refresh every few minutes and summarize picker throughput
              across orders, picks, and fulfillment efficiency.
            </p>
          </div>
          <Button
            variant="brand"
            onClick={refresh}
            disabled={loading}
            className="uppercase text-[10px] tracking-[0.3em]"
          >
            {loading ? "Refreshing..." : "Sync Now"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 text-sm text-gray-600">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Total Orders
            </p>
            <p className="text-3xl text-gray-900">
              {metrics ? metrics.totalOrders.toLocaleString() : "—"}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              across all statuses
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Total Items
            </p>
            <p className="text-3xl text-gray-900">
              {metrics ? metrics.totalItems.toLocaleString() : "—"}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              includes picked & pending
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Picker Window
            </p>
            <p className="text-3xl text-gray-900">
              {metrics ? `${metrics.pickerWindowMinutes} min` : "—"}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              recent window
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 text-xs font-bold uppercase tracking-[0.4em] text-gray-400 flex items-center gap-2">
          <Info size={14} /> Data powered by `/ops/performance`
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;
