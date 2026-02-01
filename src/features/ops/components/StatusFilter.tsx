import React from "react";
import { StockRequestStatus } from "@/domains/stock-requests/types";

interface StatusFilterProps {
  currentFilter: StockRequestStatus | "all";
  onFilterChange: (status: StockRequestStatus | "all") => void;
}

const FILTER_OPTIONS: (StockRequestStatus | "all")[] = [
  "all",
  "pending",
  "approved",
  "resolved",
  "rejected",
  "cancelled",
];

export const StatusFilter: React.FC<StatusFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100">
      <div className="flex gap-3 flex-wrap">
        {FILTER_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              currentFilter === status
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
