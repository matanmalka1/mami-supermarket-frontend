import { useEffect, useState } from "react";
import { branchService } from "@/domains/branch/service";
import type { BranchResponse } from "@/domains/branch/types";
import { extractArrayPayload } from "@/utils/api-response";

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
        setState({
          branches: extractArrayPayload<BranchResponse>(data),
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : "Failed to load branches";
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
