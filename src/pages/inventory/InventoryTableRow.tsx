import React from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { BadgeVariant } from "@/components/ui/Badge";
import InventoryTableMenu from "./InventoryTableMenu";

interface InventoryTableRowProps {
  inv: any;
  available: number;
  reserved: number;
  branchName: string;
  statusLabel: string;
  statusVariant: BadgeVariant;
  isLowStock: boolean;
  activeMenuId: number | null;
  onMenuToggle: (id: number | null) => void;
  onUpdateStock: (id: number, qty: number) => void;
  onViewAnalytics: (row: any) => void;
  onViewRelocation: (row: any) => void;
}

const InventoryTableRow: React.FC<InventoryTableRowProps> = ({
  inv,
  available,
  reserved,
  branchName,
  statusLabel,
  statusVariant,
  isLowStock,
  activeMenuId,
  onMenuToggle,
  onUpdateStock,
  onViewAnalytics,
  onViewRelocation,
}) => (
  <tr
    className={
      isLowStock ? "bg-emerald-50/40 hover:bg-emerald-50/30" : undefined
    }
  >
    <td>
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
          <h4 className="text-lg leading-tight ">{inv.product?.name}</h4>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            SKU: {inv.product?.sku}
          </p>
        </div>
      </div>
    </td>
    <td>
      <div className="flex flex-col gap-2">
        <StatusBadge status={statusLabel} variant={statusVariant} />
        <p className="text-sm text-gray-600">{branchName}</p>
      </div>
    </td>
    <td>
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
    </td>
    <td>
      <span className="text-orange-500 ">{reserved} Units</span>
    </td>
    <td className="text-right relative">
      <button
        onClick={() => onMenuToggle(activeMenuId === inv.id ? null : inv.id)}
        className={`p-2 transition-all rounded-xl ${activeMenuId === inv.id ? "text-gray-900 bg-gray-100" : "text-gray-300 hover:text-gray-900"}`}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {activeMenuId === inv.id && (
        <InventoryTableMenu
          inv={inv}
          onMenuToggle={onMenuToggle}
          onViewAnalytics={onViewAnalytics}
          onViewRelocation={onViewRelocation}
        />
      )}
    </td>
  </tr>
);

export default InventoryTableRow;
