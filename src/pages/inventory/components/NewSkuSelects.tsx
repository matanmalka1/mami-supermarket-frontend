import React from "react";
import type { Category } from "@/domains/catalog/types";
import type { BranchResponse } from "@/domains/branch/types";
import SelectField from "@/components/ui/form/SelectField";
import Grid from "@/components/ui/Grid";

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
  <Grid cols={2} gap={4}>
    <SelectField
      label="Category"
      value={selectedCategory}
      onChange={(event) => onCategoryChange((event.target as HTMLSelectElement).value)}
      disabled={categoriesLoading}
      options={
        categoriesLoading
          ? [{ value: "", label: "Loading categories…" }]
          : categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))
      }
    />
    <SelectField
      label="Branch"
      value={selectedBranch}
      onChange={(event) => onBranchChange((event.target as HTMLSelectElement).value)}
      disabled={branchesLoading}
      options={
        branchesLoading
          ? [{ value: "", label: "Loading branches…" }]
          : branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))
      }
    />
  </Grid>
);

export default NewSkuSelects;
