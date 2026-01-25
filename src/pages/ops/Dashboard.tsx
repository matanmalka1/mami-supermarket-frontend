
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import DashboardHero from "@/components/ops/DashboardHero";
import LoadingState from "@/components/shared/LoadingState";
import { toast } from "react-hot-toast";
import OrderTable from "@/features/ops/components/OrderTable";
import { useOrders } from "@/hooks/useOrders";
import { apiService } from "@/services/api";

type PerformanceMetrics = {
  batchEfficiency?: string | number;
  livePickers?: string | number;
  [key: string]: any;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, loading, selectedIds, toggleSelect, refresh } = useOrders();
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const expressDue = orders.filter((o) => o.urgency === "CRITICAL").length;
  const urgentOrders = useMemo(() => orders.filter((o) => o.urgency === "CRITICAL"), [orders]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [perfLoading, setPerfLoading] = useState(true);
  const [perfError, setPerfError] = useState<string | null>(null);

  const startBatch = async () => {
    if (selectedIds.length < 2) return toast.error("Select at least 2 orders for a batch");
    toast.loading("Submitting batch for picking...", { id: "batch" });
    try {
      await apiService.ops.createBatch(selectedIds);
      toast.success("Batch created", { id: "batch" });
      navigate(`/picking/batch-${selectedIds.join("-")}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create batch", { id: "batch" });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPerformance = async () => {
      setPerfLoading(true);
      setPerfError(null);
      try {
        const data = await apiService.ops.getPerformance();
        if (!isMounted) return;
        setPerformance(data || null);
      } catch (err: any) {
        if (!isMounted) return;
        setPerfError(err.message || "Performance metrics unavailable");
      } finally {
        if (isMounted) setPerfLoading(false);
      }
    };
    fetchPerformance();
    return () => {
      isMounted = false;
    };
  }, []);

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
