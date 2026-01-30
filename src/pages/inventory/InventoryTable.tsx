import React from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { MoreVertical, Move, Archive, BarChart2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  InventoryRow,
  getAvailableQuantity,
  getReservedQuantity,
} from "@/domains/inventory/types";

type InventoryTableProps = {
  rows: InventoryRow[];
  activeMenuId: number | null;
  onMenuToggle: (id: number | null) => void;
  onUpdateStock: (id: number, qty: number) => void;
  onViewAnalytics: (row: InventoryRow) => void;
  onViewRelocation: (row: InventoryRow) => void;
};

const InventoryTable: React.FC<InventoryTableProps> = ({
  rows,
  activeMenuId,
  onMenuToggle,
  onUpdateStock,
  onViewAnalytics,
  onViewRelocation,
}) => {
  const handleAction = (action: string, name: string) => {
    toast.success(`${action} initiated for ${name}`);
    onMenuToggle(null);
  };

  return (
    <Table>
      <THead>
        <TR isHoverable={false}>
          <TH>Product Details</TH>
          <TH>Branch</TH>
          <TH className="text-center">Stock Level</TH>
          <TH>Reserved</TH>
          <TH className="text-right">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {rows.length === 0 ? (
          <TR>
            <TD
              colSpan={5}
              className="text-center text-gray-400 py-12 font-bold "
            >
              No inventory found.
            </TD>
          </TR>
        ) : (
          rows.map((inv) => {
            const available = getAvailableQuantity(inv);
            const reserved = getReservedQuantity(inv);
            const branchName = inv.branch?.name || "Central Hub";
            const isLowStock = available <= 25;
            const statusLabel = isLowStock ? "LOW_STOCK" : "OPTIMAL";
            return (
              <TR
                key={inv.id}
                className={
                  isLowStock
                    ? "bg-emerald-50/40 hover:bg-emerald-50/30"
                    : undefined
                }
              >
                <TD>
                  <div className="flex items-center gap-4">
                    {inv.product?.imageUrl ? (
                      <img
                        src={inv.product?.imageUrl}
                        alt={inv.product?.name}
                        className="w-14 h-14 rounded-xl object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 border flex items-center justify-center text-gray-400 ">
                        {(inv.product?.name || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg leading-tight ">
                        {inv.product?.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        SKU: {inv.product?.sku}
                      </p>
                    </div>
                  </div>
                </TD>
                <TD>
                  <div className="flex flex-col gap-2">
                    <StatusBadge status={statusLabel} />
                    <p className="text-sm text-gray-600">{branchName}</p>
                  </div>
                </TD>
                <TD>
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      className="w-24 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-center focus:border-[#006666] outline-none"
                      value={available}
                      onChange={(e) =>
                        onUpdateStock(inv.id, parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                </TD>
                <TD>
                  <span className="text-orange-500 ">{reserved} Units</span>
                </TD>
                <TD className="text-right relative">
                  <button
                    onClick={() =>
                      onMenuToggle(activeMenuId === inv.id ? null : inv.id)
                    }
                    className={`p-2 transition-all rounded-xl ${
                      activeMenuId === inv.id
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-300 hover:text-gray-900"
                    }`}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {activeMenuId === inv.id && (
                    <div className="absolute right-8 top-16 w-56 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[70] p-2 animate-in zoom-in-95">
                      <button
                        onClick={() => {
                          handleAction(
                            "Relocation",
                            inv.product?.name ?? "SKU",
                          );
                          onViewRelocation(inv);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs"
                      >
                        <Move size={14} className="text-[#006666]" /> Relocate
                        SKU
                      </button>
                      <button
                        onClick={() => {
                          handleAction(
                            "Analytics View",
                            inv.product?.name ?? "SKU",
                          );
                          onViewAnalytics(inv);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs"
                      >
                        <BarChart2 size={14} className="text-blue-500" /> Item
                        Analytics
                      </button>
                      <div className="h-px bg-gray-50 my-1" />
                      <button
                        onClick={() =>
                          handleAction("Archival", inv.product?.name ?? "SKU")
                        }
                        className="w-full text-left p-3 rounded-xl hover:bg-red-50 hover:text-red-500 flex items-center gap-3 transition-colors text-xs"
                      >
                        <Archive size={14} className="text-red-400" /> Archive
                        SKU
                      </button>
                    </div>
                  )}
                </TD>
              </TR>
            );
          })
        )}
      </TBody>
    </Table>
  );
};

export default InventoryTable;
