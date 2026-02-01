import type { OpsPerformanceMetrics } from "@/domains/ops/types";
import { formatPercent, formatNumber } from "./formatters";

/**
 * Configuration for performance summary cards
 */
export const getSummaryCards = (metrics: OpsPerformanceMetrics | null) => [
  {
    label: "Batch Efficiency",
    value: metrics ? formatPercent(metrics.batchEfficiency) : "—",
    sub: metrics
      ? `${metrics.pickedItems}/${metrics.totalItems} items picked`
      : undefined,
  },
  {
    label: "Live Pickers",
    value: metrics ? formatNumber(metrics.livePickers) : "—",
    sub: metrics ? `Window: ${metrics.pickerWindowMinutes} min` : undefined,
  },
  {
    label: "Active Orders",
    value: metrics
      ? `${metrics.activeOrders.toLocaleString()} / ${metrics.totalOrders.toLocaleString()}`
      : "—",
    sub: "Created vs. in-progress",
  },
  {
    label: "Items Picked",
    value: metrics ? metrics.pickedItems.toLocaleString() : "—",
    sub: "Since start of day",
  },
];
