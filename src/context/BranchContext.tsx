import { useEffect, useState, type FC, type ReactNode } from "react";
import { apiService } from "@/services/api";
import { BranchResponse } from "@/domains/branch/types";
import { BranchContext, STORAGE_KEY } from "./branch-context-core";

export const BranchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const data = await apiService.branches.list({ limit: 50 });
        if (!active) return;
        setBranches(data || []);
        const storedId = localStorage.getItem(STORAGE_KEY);
        const resolved =
          data?.find((branch: BranchResponse) => branch.id === Number(storedId)) ?? data?.[0] ?? null;
        setSelectedBranch(resolved);
        setError(null);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Failed to load branches");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchBranches();
    return () => {
      active = false;
    };
  }, []);

  const selectBranch = (branch: BranchResponse) => {
    setSelectedBranch(branch);
    localStorage.setItem(STORAGE_KEY, String(branch.id));
  };

  return (
    <BranchContext.Provider
      value={{ branches, selectedBranch, selectBranch, loading, error }}
    >
      {children}
    </BranchContext.Provider>
  );
};
