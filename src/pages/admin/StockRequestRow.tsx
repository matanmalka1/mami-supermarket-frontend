import React from "react";
import { CheckCircle2, Clock, Package, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { AdminStockRequest } from "@/domains/admin/types";

export type { AdminStockRequest };

type Props = {
  request: AdminStockRequest;
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
}) => {
  const status = request.status ?? "PENDING";
  const statusVariant =
    status === "APPROVED"
      ? "emerald"
      : status === "REJECTED"
        ? "red"
        : "orange";
  const displayTime = request.createdAt
    ? new Date(request.createdAt).toLocaleString()
    : request.time || "Just now";
  return (
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
          <p className="text-lg text-gray-900">
            {request.productName || "Product"}
          </p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {request.quantity ?? "-"} units •{" "}
            {request.requestType
              ? request.requestType.replace("_", " ")
              : "Request"}
          </p>
          {request.productSku && (
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              SKU: {request.productSku}
            </p>
          )}
          {request.branchName && (
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.4em] mt-1">
              Branch: {request.branchName}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={statusVariant}>{status}</Badge>
        <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
          <Clock size={14} /> {displayTime}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={onReject}
          >
            <XCircle size={14} /> Reject
          </Button>
          <Button
            variant="brand"
            size="sm"
            disabled={disabled}
            onClick={onApprove}
          >
            <CheckCircle2 size={14} /> Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockRequestRow;
