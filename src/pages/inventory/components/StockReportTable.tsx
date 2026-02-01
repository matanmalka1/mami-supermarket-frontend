import React from "react";
import type { InventoryRow } from "@/domains/inventory/types";
import BaseTable, { type ColumnDefinition } from "@/components/ui/BaseTable";

type Props = {
  rows: InventoryRow[];
};

const columns: ColumnDefinition<InventoryRow>[] = [
  { header: "SKU" },
  { header: "Product" },
  { header: "Branch" },
  { header: "Available", className: "text-center" },
  { header: "Reserved", className: "text-center" },
  { header: "Status", className: "text-center" },
];

const StockReportTable: React.FC<Props> = ({ rows }) => (
  <BaseTable
    data={rows}
    columns={columns}
    emptyLabel="No inventory rows available"
    rowKey={(row) => row.id}
    renderRow={(row) => {
      const available = row.availableQuantity ?? row.available_quantity ?? 0;
      const reserved = row.reservedQuantity ?? row.reserved_quantity ?? 0;
      const status =
        available <= 0 ? "out" : available <= 25 ? "low" : "healthy";
      return (
        <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
          <td className="py-4 px-2">
            <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {row.product?.sku || "N/A"}
            </span>
          </td>
          <td className="py-4 px-2 font-medium text-gray-900">
            {row.product?.name}
          </td>
          <td className="py-4 px-2 text-sm text-gray-600">
            {row.branch?.name || "Central Hub"}
          </td>
          <td className="py-4 px-2 text-center">
            <span
              className={`font-bold ${
                available <= 0
                  ? "text-red-600"
                  : available <= 25
                    ? "text-amber-600"
                    : "text-emerald-600"
              }`}
            >
              {available.toLocaleString()}
            </span>
          </td>
          <td className="py-4 px-2 text-center">
            <span className="font-semibold text-orange-600">
              {reserved.toLocaleString()}
            </span>
          </td>
          <td className="py-4 px-2 text-center">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                status === "healthy"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : status === "low"
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {status}
            </span>
          </td>
        </tr>
      );
    }}
  />
);

export default StockReportTable;
