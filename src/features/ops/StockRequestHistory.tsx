import React from "react";
import { CheckCircle2, History, Package } from "lucide-react";
import Badge from "../../components/ui/Badge";

interface Props {
  items?: Array<{
    id: string;
    title: string;
    sku?: string;
    quantity: number;
    status: "DELIVERED" | "IN_TRANSIT";
    ago: string;
  }>;
}

const defaultItems: Props["items"] = [
  {
    id: "1",
    title: "Organic Milk 2L",
    sku: "SKU: 9422",
    quantity: 42,
    status: "DELIVERED",
    ago: "2 hours ago",
  },
  {
    id: "2",
    title: "Artisan Baguette",
    sku: "SKU: 3341",
    quantity: 50,
    status: "IN_TRANSIT",
    ago: "1 hour ago",
  },
];

const StockRequestHistory: React.FC<Props> = ({ items = defaultItems }) => (
  <div className="space-y-4">
    {items.map((row) => (
      <div
        key={row.id}
        className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all"
      >
        <div className="flex gap-6 items-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
            <Package size={24} />
          </div>
          <div>
            <h4 className="font-black text-xl italic">{row.title}</h4>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
              Requested {row.ago} {row.sku ? `• ${row.sku}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-lg font-black italic">{row.quantity} Units</p>
            <Badge color={row.status === "DELIVERED" ? "emerald" : "orange"}>
              {row.status === "DELIVERED" ? "Delivered" : "In Transit"}
            </Badge>
          </div>
          {row.status === "DELIVERED" ? (
            <CheckCircle2 className="text-emerald-500" />
          ) : (
            <History className="text-orange-400 animate-spin-slow" />
          )}
        </div>
      </div>
    ))}
  </div>
);

export default StockRequestHistory;
