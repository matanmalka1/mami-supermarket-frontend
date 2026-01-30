
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import DashboardHero from "@/components/ops/DashboardHero";
import LoadingState from "@/components/shared/LoadingState";
import { toast } from "react-hot-toast";
import OrderTable from "@/features/ops/components/OrderTable";
import { useOrders } from "@/features/ops/hooks/useOrders";
import { useOpsBatchActions } from "@/features/ops/hooks/useOpsBatchActions";
import { useOpsPerformance } from "@/features/ops/hooks/useOpsPerformance";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, loading, selectedIds, toggleSelect, refresh } = useOrders();
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const expressDue = orders.filter((o) => o.urgency === "CRITICAL").length;
  const urgentOrders = useMemo(() => orders.filter((o) => o.urgency === "CRITICAL"), [orders]);
  const { metrics: performance, loading: perfLoading, error: perfError, refresh: refreshPerf } =
    useOpsPerformance();
  const { createBatch } = useOpsBatchActions();

  const startBatch = async () => {
    if (selectedIds.length < 2) return toast.error("Select at least 2 orders for a batch");
    toast.loading("Submitting batch for picking...", { id: "batch" });
    try {
      await createBatch(selectedIds);
      toast.success("Batch created", { id: "batch" });
      navigate(`/picking/batch-${selectedIds.join("-")}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create batch", { id: "batch" });
    }
  };

  useEffect(() => {
    refreshPerf();
  }, [refreshPerf]);

  useEffect(() => {
    const handleFocus = () => refresh();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refresh]);

  const formatMetricValue = (value?: string | number) =>
    value !== undefined && value !== null ? value : "N/A";
  const metricSubtitle = perfLoading
    ? "Syncing metrics..."
    : "Live performance overview";

  if (loading) return <LoadingState label="Syncing orders..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHero
        ordersCount={orders.length}
        pendingCount={pendingCount}
        expressDue={expressDue}
        selectedCount={selectedIds.length}
        onStartBatch={startBatch}
        onViewBoard={() => navigate("/picking")}
        metricSubtitle={metricSubtitle}
        batchEfficiency={formatMetricValue(performance?.batchEfficiency)}
        livePickers={formatMetricValue(performance?.livePickers)}
        perfLoading={perfLoading}
        urgentCount={urgentOrders.length}
      />

      {perfError && !perfLoading && (
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
          {perfError}
        </p>
      )}

      <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-emerald-50">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Order Status Workflow
          </p>
          <p className="mt-2 text-[13px] text-gray-700">
            Admins can update any order’s status from the <span className="font-black">Process</span> column.
            Progress orders through <span className="font-semibold">IN_PROGRESS → READY → OUT_FOR_DELIVERY → DELIVERED</span> (missing picks become <span className="font-semibold">MISSING</span>),
            and the allowed transitions mirror the pick status rules—only orders where every item is <span className="font-semibold">PICKED</span> can move to READY.
          </p>
        </div>
        <OrderTable orders={orders} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
      </div>
    </div>
  );
};

export default Dashboard;
