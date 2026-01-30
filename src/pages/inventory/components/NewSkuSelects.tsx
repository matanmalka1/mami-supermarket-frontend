import React from "react";
import type { Category } from "@/domains/catalog/types";
import type { BranchResponse } from "@/domains/branch/types";

type Props = {
  categories: Category[];
  branches: BranchResponse[];
  selectedCategory: string;
  selectedBranch: string;
  onCategoryChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  categoriesLoading: boolean;
  branchesLoading: boolean;
};

const NewSkuSelects: React.FC<Props> = ({
  categories,
  branches,
  selectedCategory,
  selectedBranch,
  onCategoryChange,
  onBranchChange,
  categoriesLoading,
  branchesLoading,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
        Category
      </label>
      <select
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
        disabled={categoriesLoading}
        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold appearance-none"
      >
        {categoriesLoading ? (
          <option value="">Loading categories…</option>
        ) : (
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        )}
      </select>
    </div>
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
        Branch
      </label>
      <select
        value={selectedBranch}
        onChange={(event) => onBranchChange(event.target.value)}
        disabled={branchesLoading}
        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold appearance-none"
      >
        {branchesLoading ? (
          <option value="">Loading branches…</option>
        ) : (
          branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))
        )}
      </select>
    </div>
  </div>
);

export default NewSkuSelects;
