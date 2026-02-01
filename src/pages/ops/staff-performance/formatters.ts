/**
 * Format percentage value for display
 */
export const formatPercent = (value?: number): string =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "—";

/**
 * Format number value for display
 */
export const formatNumber = (value?: number): string | number =>
  typeof value === "number" ? value : "—";
