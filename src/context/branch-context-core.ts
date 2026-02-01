import { BranchResponse } from "@/domains/branch/types";
import { createContext, useContext } from "react";

export type BranchContextValue = {
  branches: BranchResponse[];
  selectedBranch: BranchResponse | null;
  selectBranch: (branch: BranchResponse) => void;
  loading: boolean;
  error: string | null;
};

export const STORAGE_KEY = "mami_selected_branch_id";

export const BranchContext = createContext<BranchContextValue | undefined>(undefined);

export const useBranchSelection = (): BranchContextValue => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranchSelection must be used within BranchProvider");
  }
  return context;
};

export const useOptionalBranchSelection = (): BranchContextValue | null => {
  return useContext(BranchContext) ?? null;
};
