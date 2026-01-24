import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import { apiService } from "../../services/api";
import { StockRequestStatus } from "../../services/admin-service";
import StockRequestRow, { StockRequest } from "./StockRequestRow";

const StockRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.admin.getStockRequests({ status: "PENDING" });
      const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setRequests(rows);
    } catch (err: any) {
      toast.error(err.message || "Failed to load request queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const resolveSingle = async (id: string, status: StockRequestStatus) => {
    setActionLoading(true);
    try {
      await apiService.admin.resolveStockRequest(id, { status });
      toast.success(`Request ${status.toLowerCase()}`);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const resolveSelected = async (status: StockRequestStatus) => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await apiService.admin.bulkResolveStockRequests(
        selectedIds.map((id) => ({ request_id: id, status })),
      );
      toast.success(`Bulk ${status.toLowerCase()} complete`);
      setSelectedIds([]);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Bulk update failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Replenishment Queue</h1>
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
          <div className="p-16 text-center text-gray-300 font-black uppercase tracking-[0.3em]">
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
              onApprove={() => resolveSingle(req.id, "APPROVED")}
              onReject={() => resolveSingle(req.id, "REJECTED")}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StockRequestManager;
