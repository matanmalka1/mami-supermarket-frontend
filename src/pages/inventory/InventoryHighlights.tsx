import React from "react";
import { InventoryRow } from "@/domains/inventory/types";

// Local helpers for feature use only
const getAvailableQuantity = (row: InventoryRow) => row.availableQuantity ?? 0;
const getReservedQuantity = (row: InventoryRow) => row.reservedQuantity ?? 0;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(value);

const InventoryHighlights: React.FC<{ rows: InventoryRow[] }> = ({ rows }) => {
  const totalAvailable = rows.reduce(
    (sum, row) => sum + getAvailableQuantity(row),
    0,
  );
  const totalReserved = rows.reduce(
    (sum, row) => sum + getReservedQuantity(row),
    0,
  );
  const lowStockThreshold = 25;
  const lowStockCount = rows.filter(
    (row) => getAvailableQuantity(row) <= lowStockThreshold,
  ).length;

  const stats = [
    { label: "Active SKUs", value: rows.length, sub: "Across branches" },
    { label: "Total available", value: totalAvailable, sub: "Units ready" },
    {
      label: "Reserved + pending",
      value: totalReserved,
      sub: "Committed inventory",
    },
    {
      label: "Low-stock alerts",
      value: lowStockCount,
      sub: `≤ ${lowStockThreshold} units`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[2rem] border border-gray-100 bg-white/70 p-5 shadow-xl flex flex-col gap-2"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            {stat.label}
          </p>
          <p className="text-3xl font-black  text-gray-900">
            {formatNumber(stat.value)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">
            {stat.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InventoryHighlights;
