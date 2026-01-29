import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/api";
import { StockRequestStatus } from "@/services/admin-service";
import type { StockRequest } from "@/features/admin/types";
import { extractArrayPayload } from "@/utils/api-response";

const ensureQuantity = (request: StockRequest) => {
  const qty = request.quantity ?? 0;
  if (!qty || qty <= 0) {
    throw new Error("Request quantity missing; cannot approve.");
  }
  return qty;
};

const buildResolvePayload = (request: StockRequest, status: StockRequestStatus) => {
  const payload: {
    status: StockRequestStatus;
    approvedQuantity?: number;
    rejectionReason?: string;
  } = { status };
  if (status === "APPROVED") {
    payload.approvedQuantity = ensureQuantity(request);
  } else {
    payload.rejectionReason = "Rejected by operations manager";
  }
  return payload;
};

const buildBulkItem = (request: StockRequest, status: StockRequestStatus) => {
  const item: {
    request_id: number;
    status: StockRequestStatus;
    approved_quantity?: number;
    rejection_reason?: string;
  } = {
    request_id: request.id,
    status,
  };
  if (status === "APPROVED") {
    item.approved_quantity = ensureQuantity(request);
  } else {
    item.rejection_reason = "Rejected by operations manager";
  }
  return item;
};

export const useStockRequestQueue = () => {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data: any = await apiService.admin.getStockRequests({ status: "PENDING" });
      setRequests(extractArrayPayload<StockRequest>(data));
    } catch (err: any) {
      toast.error(err.message || "Failed to load request queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const resolveSingle = async (request: StockRequest, status: StockRequestStatus) => {
    setActionLoading(true);
    try {
      await apiService.admin.resolveStockRequest(request.id, buildResolvePayload(request, status));
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
      const selectedRequests = selectedIds
        .map((id) => requests.find((req) => req.id === id))
        .filter((req): req is StockRequest => Boolean(req));
      if (selectedRequests.length === 0) {
        throw new Error("No matching requests found.");
      }
      await apiService.admin.bulkResolveStockRequests(
        selectedRequests.map((req) => buildBulkItem(req, status)),
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

  return {
    requests,
    loading,
    selectedIds,
    actionLoading,
    toggleSelect,
    resolveSingle,
    resolveSelected,
  };
};
