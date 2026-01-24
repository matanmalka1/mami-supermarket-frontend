import React from "react";
import { CheckCircle2, Clock, Package, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export type StockRequest = {
  id: string;
  product_name?: string;
  quantity?: number;
  request_type?: string;
  status?: string;
  requester?: string;
  time?: string;
};

type Props = {
  request: StockRequest;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
};

const StockRequestRow: React.FC<Props> = ({
  request,
  selected,
  disabled,
  onSelect,
  onApprove,
  onReject,
}) => (
  <div className="bg-white border rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
    <div className="flex items-center gap-4">
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="w-5 h-5 accent-emerald-600"
      />
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border">
        <Package size={20} />
      </div>
      <div>
        <p className="font-black text-lg italic text-gray-900">
          {request.product_name || "Product"}
        </p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {request.quantity} units • {request.request_type || "Request"}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Badge color="orange">PENDING</Badge>
      <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
        <Clock size={14} /> {request.time || "Just now"}
      </span>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" disabled={disabled} onClick={onReject}>
          <XCircle size={14} /> Reject
        </Button>
        <Button variant="emerald" size="sm" disabled={disabled} onClick={onApprove}>
          <CheckCircle2 size={14} /> Approve
        </Button>
      </div>
    </div>
  </div>
);

export default StockRequestRow;
