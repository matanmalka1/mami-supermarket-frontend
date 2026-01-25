import { useEffect, useState } from "react";
import { branchService } from "@/services/branch-service";
import type { BranchResponse } from "@/types/branch";

type BranchState = {
  branches: BranchResponse[];
  loading: boolean;
  error: string | null;
};

export const useBranches = (): BranchState => {
  const [state, setState] = useState<BranchState>({
    branches: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const fetchBranches = async () => {
      try {
        const data = await branchService.list({ limit: 50 });
        if (!active) return;
        const items = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : [];
        setState({ branches: items, loading: false, error: null });
      } catch (err: unknown) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Failed to load branches";
        setState({ branches: [], loading: false, error: message });
      }
    };
    void fetchBranches();
    return () => {
      active = false;
    };
  }, []);

  return state;
};
