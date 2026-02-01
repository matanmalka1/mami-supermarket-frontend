import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/domains/admin/service";
import { branchService } from "@/domains/branch/service";
import { extractArrayPayload } from "@/utils/api-response";
import type { BranchResponse } from "@/domains/branch/types";

export const useDeliverySlots = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data: any = await adminService.getDeliverySlots();
      setSlots(extractArrayPayload<any>(data));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load delivery slots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  useEffect(() => {
    let active = true;
    const loadBranches = async () => {
      try {
        const data = await branchService.list?.({ limit: 50 } as any);
        if (!active) return;
        setBranches(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };
    loadBranches();
    return () => {
      active = false;
    };
  }, []);

  return { slots, setSlots, branches, loading, error, refreshSlots: loadSlots };
};
