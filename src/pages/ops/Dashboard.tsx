import React, { useCallback, useEffect, useMemo, useState } from "react";
import DashboardHero from "@/components/ops/dashboard/DashboardHero";
import LoadingState from "@/components/ui/LoadingState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Pagination from "@/components/ui/Pagination";
import OrderTable from "@/features/ops/components/OrderTable";
import { type OpsOrderStatus } from "@/features/ops/components/OrderStatusSelect";
import { toast } from "react-hot-toast";
import { opsService } from "@/domains/ops/service";
import { useOrders } from "@/features/ops/hooks/useOrders";
import { useOpsPerformance } from "@/features/ops/hooks/useOpsPerformance";
import { OrderStatus } from "@/domains/orders/types";

const Dashboard: React.FC = () => {
  const { orders, loading, selectedIds, toggleSelect, refresh } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const statusFilter: string = "all";
  const urgencyFilter: string = "all";
  const searchQuery: string = "";
  const itemsPerPage = 20;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusMatch =
        statusFilter === "all" || order.status === statusFilter;
      const urgencyMatch =
        urgencyFilter === "all" || order.urgency === urgencyFilter;
      const searchMatch =
        !searchQuery ||
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      return statusMatch && urgencyMatch && searchMatch;
    });
  }, [orders, statusFilter, urgencyFilter, searchQuery]);

  // const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const pendingCount = orders.filter(
    (o) => o.status === OrderStatus.CREATED,
  ).length;
  const expressDue = orders.filter((o) => o.urgency === "critical").length;
  const urgentOrders = useMemo(
    () => orders.filter((o) => o.urgency === "critical"),
    [orders],
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, urgencyFilter, searchQuery]);
  const {
    metrics: performance,
    loading: perfLoading,
    error: perfError,
    refresh: refreshPerf,
  } = useOpsPerformance();
  const handleStatusChange = useCallback(
    async (orderId: number, status: OpsOrderStatus) => {
      try {
        await opsService.updateOrderStatus(orderId, { status });
        toast.success("Order status updated.", {
          id: `order-status-${orderId}`,
        });
        refresh();
      } catch (err: any) {
        toast.error(err?.message || "Failed to update the order status.", {
          id: `order-status-${orderId}`,
        });
      }
    },
    [refresh],
  );
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
        metricSubtitle={metricSubtitle}
        batchEfficiency={formatMetricValue(performance?.batchEfficiency)}
        livePickers={formatMetricValue(performance?.livePickers)}
        perfLoading={perfLoading}
        urgentCount={urgentOrders.length}
      />

      {perfError && !perfLoading && (
        <ErrorMessage
          message={perfError}
          className="text-xs uppercase tracking-[0.2em] text-red-600"
        />
      )}

      <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-emerald-50">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Order Status Workflow
          </p>
          <p className="mt-2 text-[13px] text-gray-700">
            Admins can update any order’s status from the{" "}
            <span className="">Process</span> column. Progress orders through{" "}
            <span className="font-semibold">
              IN_PROGRESS → READY → OUT_FOR_DELIVERY → DELIVERED
            </span>{" "}
            (missing picks become <span className="font-semibold">MISSING</span>
            ), and the allowed transitions mirror the pick status rules—only
            orders where every item is{" "}
            <span className="font-semibold">PICKED</span> can move to READY.
          </p>
        </div>
        <OrderTable
          orders={paginatedOrders}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
