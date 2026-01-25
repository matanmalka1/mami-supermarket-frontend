
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import StatCard from "@/components/ui/StatCard";
import Grid from "@/components/ui/Grid";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/shared/LoadingState";
import { Layers, Play } from "lucide-react";
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
  const { orders, loading, selectedIds, toggleSelect } = useOrders();
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const expressDue = orders.filter((o) => o.urgency === "CRITICAL").length;
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

  const formatMetricValue = (value?: string | number) =>
    value !== undefined && value !== null ? value : "N/A";
  const metricSubtitle = perfLoading
    ? "Syncing metrics..."
    : "Live performance overview";

  if (loading) return <LoadingState label="Syncing orders..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Orders Management</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {orders.length} ACTIVE ORDERS
          </p>
        </div>
        {selectedIds.length > 0 && (
          <Button 
            variant="emerald" 
            className="rounded-2xl h-14 px-8 shadow-xl animate-in slide-in-from-right-4"
            icon={<Layers size={20} />}
            onClick={startBatch}
          >
            Start Batch Pick ({selectedIds.length}) <Play size={16} className="ml-2 fill-current" />
          </Button>
        )}
      </div>

      <Grid cols={4} gap={6}>
        <StatCard label="Total Pending" value={pendingCount} />
        <StatCard label="Express Due" value={expressDue} sub="Urgency: CRITICAL" />
        <StatCard
          label="Batch Efficiency"
          value={formatMetricValue(performance?.batchEfficiency)}
          sub={metricSubtitle}
          loading={perfLoading}
        />
        <StatCard
          label="Live Pickers"
          value={formatMetricValue(performance?.livePickers)}
          sub={metricSubtitle}
          loading={perfLoading}
        />
      </Grid>
      {perfError && !perfLoading && (
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
          {perfError}
        </p>
      )}

      <OrderTable orders={orders} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
    </div>
  );
};

export default Dashboard;
