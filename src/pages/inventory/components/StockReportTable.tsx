import React from "react";
import type { InventoryRow } from "@/types/inventory";

type Props = {
  rows: InventoryRow[];
};

const StockReportTable: React.FC<Props> = ({ rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-[0.3em] text-gray-400">
          <th className="py-3">SKU</th>
          <th className="py-3">Product</th>
          <th className="py-3">Branch</th>
          <th className="py-3 text-center">Available</th>
          <th className="py-3 text-center">Reserved</th>
          <th className="py-3 text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const available = row.availableQuantity ?? row.available_quantity ?? 0;
          const reserved = row.reservedQuantity ?? row.reserved_quantity ?? 0;
          const status =
            available <= 0 ? "out" : available <= 25 ? "low" : "healthy";
          return (
            <tr key={row.id} className="border-b border-gray-50">
              <td className="py-3 font-black uppercase tracking-[0.2em]">{row.product?.sku || "n/a"}</td>
              <td className="py-3">{row.product?.name}</td>
              <td className="py-3">{row.branch?.name || "Central Hub"}</td>
              <td className="py-3 text-center font-black">{available}</td>
              <td className="py-3 text-center text-orange-500">{reserved}</td>
              <td className="py-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${
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
        })}
      </tbody>
    </table>
  </div>
);

export default StockReportTable;
