import { StatItem, ChartEntry } from "./types";

export type RevenueData = { labels: string[]; values: number[] };

const formatCurrency = (value: number) =>
  `₪${Math.round(value).toLocaleString("en-US")}`;

export type AnalyticsMetrics = {
  stats: StatItem[];
  chartEntries: ChartEntry[];
  scopeText: string;
  momentumText: string;
  momentumWidth: number;
  heroDetail: string;
  hasData: boolean;
};

export const buildAnalyticsMetrics = (
  revenue: RevenueData,
): AnalyticsMetrics => {
  const hasData = revenue.values.length > 0;
  const dataPoints = revenue.values.length;
  const totalRevenue = hasData ? (revenue.values.at(-1) ?? 0) : 0;
  const averageRevenue = hasData
    ? revenue.values.reduce((sum, value) => sum + value, 0) / dataPoints
    : 0;
  const priorRevenue =
    hasData && dataPoints > 1 ? (revenue.values.at(-2) ?? 0) : null;
  const firstRevenue = hasData ? (revenue.values[0] ?? 0) : 0;
  const changePercent =
    priorRevenue && priorRevenue > 0
      ? ((totalRevenue - priorRevenue) / priorRevenue) * 100
      : null;
  const changeFromStart =
    firstRevenue > 0
      ? ((totalRevenue - firstRevenue) / firstRevenue) * 100
      : null;
  const maxValue = hasData ? Math.max(...revenue.values) : 0;
  const lastLabel = hasData ? revenue.labels.at(-1) : null;
  const firstLabel = hasData ? revenue.labels[0] : null;
  const trendText =
    changePercent !== null
      ? `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}% vs prior`
      : hasData
        ? "Needs comparison data"
        : "No data yet";
  const heroDetail = hasData
    ? `${lastLabel ?? "Latest"} · ${formatCurrency(totalRevenue)}`
    : "No revenue data available for selected period";
  const stats: StatItem[] = [
    {
      label: "Total Revenue",
      value: hasData ? formatCurrency(totalRevenue) : "No data yet",
      trend: trendText,
      sub: lastLabel ? `${lastLabel} period` : "Latest period",
    },
    {
      label: "Average Period",
      value: hasData ? formatCurrency(averageRevenue) : "No data yet",
      trend: `${dataPoints} data points`,
      sub: "Period average",
    },
    {
      label: "Time Periods",
      value: dataPoints ? dataPoints.toString() : "0",
      trend:
        firstLabel && lastLabel
          ? `${firstLabel} → ${lastLabel}`
          : "No data yet",
      sub: "Days/Months analyzed",
    },
    {
      label: "Change vs Start",
      value:
        changeFromStart !== null
          ? `${changeFromStart >= 0 ? "+" : ""}${changeFromStart.toFixed(1)}%`
          : "No data yet",
      trend: hasData ? "Since first point" : "No data yet",
      sub: firstLabel ? `Start: ${firstLabel}` : "Start point",
    },
  ];
  const chartEntries: ChartEntry[] = hasData
    ? revenue.values.map((value, idx) => ({
        label: revenue.labels[idx] ?? "",
        value,
        height:
          maxValue > 0
            ? Math.max(18, Math.round((value / maxValue) * 100))
            : 18,
      }))
    : [];
  const scopeText =
    hasData && firstLabel && lastLabel
      ? `${firstLabel} → ${lastLabel} (${dataPoints} points)`
      : "No orders in selected period. Revenue data will appear once orders are delivered.";
  const momentumText = hasData
    ? changeFromStart !== null
      ? `Revenue has ${changeFromStart >= 0 ? "grown" : "declined"} ${Math.abs(
          changeFromStart,
        ).toFixed(1)}% since ${firstLabel ?? "the start"}.`
      : "Not enough data for comparison."
    : "No delivered orders yet. Only completed (DELIVERED) orders count as revenue.";
  const momentumWidth =
    hasData && changeFromStart !== null
      ? Math.min(100, Math.abs(changeFromStart))
      : 0;

  return {
    stats,
    chartEntries,
    scopeText,
    momentumText,
    momentumWidth,
    heroDetail,
    hasData,
  };
};
