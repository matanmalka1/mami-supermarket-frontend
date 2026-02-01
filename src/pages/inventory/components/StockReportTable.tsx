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
        <tr className="border-b border-gray-50">
          <td className="py-3 uppercase tracking-[0.2em]">
            {row.product?.sku || "n/a"}
          </td>
          <td className="py-3">{row.product?.name}</td>
          <td className="py-3">{row.branch?.name || "Central Hub"}</td>
          <td className="py-3 text-center">{available}</td>
          <td className="py-3 text-center text-orange-500">{reserved}</td>
          <td className="py-3 text-center">
            <span
              className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.3em] ${
                status === "healthy"
                  ? "bg-emerald-50 text-[#008A45]"
                  : status === "low"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-red-50 text-red-600"
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
