import React from "react";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/Table";
import StatusBadge from "../../components/ui/StatusBadge";
import { MoreVertical, Move, Archive, BarChart2 } from "lucide-react";
import { toast } from "react-hot-toast";

type InventoryTableProps = {
  rows: any[];
  activeMenuId: string | null;
  onMenuToggle: (id: string | null) => void;
  onUpdateStock: (id: string, qty: number) => void;
};

const InventoryTable: React.FC<InventoryTableProps> = ({
  rows,
  activeMenuId,
  onMenuToggle,
  onUpdateStock,
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
          <TH>Branch Cluster</TH>
          <TH className="text-center">Stock Level</TH>
          <TH>Reserved</TH>
          <TH className="text-right">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {rows.length === 0 ? (
          <TR>
            <TD colSpan={5} className="text-center text-gray-400 py-12 font-bold italic">
              No inventory found.
            </TD>
          </TR>
        ) : (
          rows.map((inv: any) => (
            <TR key={inv.id || inv.product?.sku || inv.product_id}>
              <TD>
                <div className="flex items-center gap-4">
                  <img
                    src={inv.product?.imageUrl || "https://picsum.photos/seed/product/80/80"}
                    alt={inv.product?.name}
                    className="w-14 h-14 rounded-xl object-cover border shadow-sm"
                  />
                  <div>
                    <h4 className="text-lg leading-tight italic">{inv.product?.name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      SKU: {inv.product?.sku}
                    </p>
                  </div>
                </div>
              </TD>
              <TD>
                <StatusBadge status={inv.branch?.name || "Central Hub"} />
              </TD>
              <TD>
                <div className="flex items-center justify-center">
                  <input
                    type="number"
                    className="w-24 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 font-black text-center focus:border-[#006666] outline-none"
                    value={inv.availableQuantity ?? inv.available_quantity ?? 0}
                    onChange={(e) => onUpdateStock(inv.id, parseInt(e.target.value) || 0)}
                  />
                </div>
              </TD>
              <TD>
                <span className="text-orange-500 font-black italic">
                  {inv.reservedQuantity ?? inv.reserved_quantity ?? 0} Units
                </span>
              </TD>
              <TD className="text-right relative">
                <button
                  onClick={() => onMenuToggle(activeMenuId === inv.id ? null : inv.id)}
                  className={`p-2 transition-all rounded-xl ${
                    activeMenuId === inv.id ? "text-gray-900 bg-gray-100" : "text-gray-300 hover:text-gray-900"
                  }`}
                >
                  <MoreVertical size={20} />
                </button>
                {activeMenuId === inv.id && (
                  <div className="absolute right-8 top-16 w-56 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[70] p-2 animate-in zoom-in-95">
                    <button
                      onClick={() => handleAction("Relocation", inv.product?.name)}
                      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs"
                    >
                      <Move size={14} className="text-[#006666]" /> Relocate SKU
                    </button>
                    <button
                      onClick={() => handleAction("Analytics View", inv.product?.name)}
                      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs"
                    >
                      <BarChart2 size={14} className="text-blue-500" /> Item Analytics
                    </button>
                    <div className="h-px bg-gray-50 my-1" />
                    <button
                      onClick={() => handleAction("Archival", inv.product?.name)}
                      className="w-full text-left p-3 rounded-xl hover:bg-red-50 hover:text-red-500 flex items-center gap-3 transition-colors text-xs"
                    >
                      <Archive size={14} className="text-red-400" /> Archive SKU
                    </button>
                  </div>
                )}
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </Table>
  );
};

export default InventoryTable;
