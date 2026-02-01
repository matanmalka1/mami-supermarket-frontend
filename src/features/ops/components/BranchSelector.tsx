import React from "react";
import type { BranchResponse } from "@/domains/branch/types";

interface BranchSelectorProps {
  branches: BranchResponse[];
  selectedBranchId: number;
  onSelectBranch: (branchId: number) => void;
  loading: boolean;
  error?: string;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 text-center text-gray-400">
        Loading branches...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Select Branch
      </label>
      <div className="grid grid-cols-2 gap-3">
        {branches.map((branch) => (
          <button
            key={branch.id}
            type="button"
            onClick={() => onSelectBranch(branch.id)}
            className={`p-4 rounded-2xl border-2 transition-all text-left ${
              selectedBranchId === branch.id
                ? "border-emerald-500 bg-emerald-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="font-semibold text-gray-900">{branch.name}</div>
            <div className="text-xs text-gray-400 mt-1">{branch.address}</div>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
