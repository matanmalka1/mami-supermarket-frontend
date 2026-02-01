import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { StockRequestStatus } from "@/domains/stock-requests/types";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

interface StockRequestCardProps {
  id: number | string;
  productName: string;
  sku: string;
  quantity: number;
  status: StockRequestStatus;
  priority?: string;
  createdAt: string;
}

const getStatusColor = (status: StockRequestStatus) => {
  switch (status) {
    case "approved":
    case "resolved":
      return "emerald";
    case "pending":
      return "orange";
    case "rejected":
    case "cancelled":
      return "red";
    default:
      return "gray";
  }
};

const getStatusIcon = (status: StockRequestStatus) => {
  switch (status) {
    case "approved":
    case "resolved":
      return <CheckCircle2 className="text-emerald-500" size={24} />;
    case "pending":
      return <Clock className="text-orange-400" size={24} />;
    case "rejected":
    case "cancelled":
      return <XCircle className="text-red-500" size={24} />;
    default:
      return <AlertCircle className="text-gray-400" size={24} />;
  }
};

export const StockRequestCard: React.FC<StockRequestCardProps> = ({
  productName,
  sku,
  quantity,
  status,
  priority,
  createdAt,
}) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all">
      <div className="flex gap-6 items-center flex-1">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl flex items-center justify-center border border-emerald-100">
          <svg
            className="text-emerald-600"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a1 1 0 000 2h1v11a2 2 0 002 2h10a2 2 0 002-2V9h1a1 1 0 100-2zM10 5h4v2h-4V5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900">{productName}</h4>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {sku}
            </p>
            <span className="text-gray-300">•</span>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{quantity}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            Units
          </p>
        </div>
        <div className="text-right min-w-[120px]">
          <Badge color={getStatusColor(status)} className="mb-2">
            {status}
          </Badge>
          {priority && (
            <p className="text-xs text-gray-400 capitalize">
              {priority} priority
            </p>
          )}
        </div>
        <div className="ml-4">{getStatusIcon(status)}</div>
      </div>
    </div>
  );
};
