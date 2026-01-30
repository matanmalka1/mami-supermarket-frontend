import React from "react";
import Button from "@/components/ui/Button";
import type { AdminStockRequestStatus } from "@/domains/admin/types";
import StockRequestRow from "./StockRequestRow";
import { useStockRequestQueue } from "@/features/admin/hooks/useStockRequestQueue";

const StockRequestManager: React.FC = () => {
  const {
    requests,
    loading,
    selectedIds,
    actionLoading,
    toggleSelect,
    resolveSingle,
    resolveSelected,
  } = useStockRequestQueue();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl  tracking-tighter">Replenishment Queue</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
            Inventory approvals • Central branch
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            disabled={selectedIds.length === 0 || actionLoading}
            onClick={() => resolveSelected("REJECTED")}
          >
            Reject Selected
          </Button>
          <Button
            variant="emerald"
            disabled={selectedIds.length === 0 || actionLoading}
            onClick={() => resolveSelected("APPROVED")}
          >
            Approve Selected
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center text-gray-300 uppercase tracking-[0.3em]">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-bold">
            No pending requests.
          </div>
        ) : (
          requests.map((req) => (
            <StockRequestRow
              key={req.id}
              request={req}
              selected={selectedIds.includes(req.id)}
              disabled={actionLoading}
              onSelect={() => toggleSelect(req.id)}
              onApprove={() => resolveSingle(req, "APPROVED")}
              onReject={() => resolveSingle(req, "REJECTED")}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StockRequestManager;
