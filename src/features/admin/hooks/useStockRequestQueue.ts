import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { adminService } from "@/domains/admin/service";
import type {
  AdminStockRequestStatus,
  AdminStockRequest,
} from "@/domains/admin/types";
import { extractArrayPayload } from "@/utils/api-response";

const ensureQuantity = (request: AdminStockRequest) => {
  const qty = request.quantity ?? 0;
  if (!qty || qty <= 0) {
    throw new Error("Request quantity missing; cannot approve.");
  }
  return qty;
};

const buildResolvePayload = (
  request: AdminStockRequest,
  status: AdminStockRequestStatus,
) => {
  const payload: {
    status: AdminStockRequestStatus;
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

const buildBulkItem = (
  request: AdminStockRequest,
  status: AdminStockRequestStatus,
) => {
  const item: {
    requestId: number;
    status: AdminStockRequestStatus;
    approvedQuantity?: number;
    rejectionReason?: string;
  } = {
    requestId: request.id,
    status,
  };
  if (status === "APPROVED") {
    item.approvedQuantity = ensureQuantity(request);
  } else {
    item.rejectionReason = "Rejected by operations manager";
  }
  return item;
};

export const useStockRequestQueue = () => {
  const [requests, setRequests] = useState<AdminStockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data: any = await adminService.getStockRequests({
        status: "PENDING",
      });
      setRequests(extractArrayPayload<AdminStockRequest>(data));
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

  const resolveSingle = async (
    request: AdminStockRequest,
    status: AdminStockRequestStatus,
  ) => {
    setActionLoading(true);
    try {
      await adminService.resolveStockRequest(
        request.id,
        buildResolvePayload(request, status),
      );
      toast.success(`Request ${status.toLowerCase()}`);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const resolveSelected = async (status: AdminStockRequestStatus) => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      const selectedRequests = selectedIds
        .map((id) => requests.find((req) => req.id === id))
        .filter((req): req is AdminStockRequest => Boolean(req));
      if (selectedRequests.length === 0) {
        throw new Error("No matching requests found.");
      }
      await adminService.bulkResolveStockRequests(
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
