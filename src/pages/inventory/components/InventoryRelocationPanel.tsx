import React, { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Grid from "@/components/ui/Grid";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import { InventoryRow } from "@/domains/inventory/types";
import type { BranchResponse } from "@/domains/branch/types";
import SelectField from "@/components/ui/form/SelectField";
import TextField from "@/components/ui/form/TextField";

type Props = {
  data: InventoryRow;
  onClose: () => void;
  branches: BranchResponse[];
  branchesLoading: boolean;
};

const InventoryRelocationPanel: React.FC<Props> = ({
  data,
  onClose,
  branches,
  branchesLoading,
}) => {
  const [targetBranch, setTargetBranch] = useState("");
  const [quantity, setQuantity] = useState(data.availableQuantity ?? 0);

  const currentBranch = data.branch?.name || "Central Hub";
  const productName = data.product?.name || "SKU";

  const options = useMemo(
    () => branches.filter((branch) => branch.name !== currentBranch),
    [branches, currentBranch],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!targetBranch) {
      toast.error("Select a destination branch");
      return;
    }
    const branchName =
      branches.find((b) => String(b.id) === targetBranch)?.name || "branch";
    toast.success(
      `Relocation scheduled: ${quantity} units of ${productName} → ${branchName}`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <form
        className="relative z-10 w-full max-w-xl space-y-6"
        onSubmit={handleSubmit}
      >
        <Card variant="default" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                Relocation
              </p>
              <h2 className="text-2xl  text-gray-900">{productName}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-[0.4em] text-gray-400"
            >
              Cancel
            </button>
          </div>
          <Grid cols={1} gap={4}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400">
                Current branch
              </label>
              <p className="text-lg">{currentBranch}</p>
            </div>
            <SelectField
              label="Destination branch"
              value={targetBranch}
              onChange={(event) =>
                setTargetBranch((event.target as HTMLSelectElement).value)
              }
              disabled={branchesLoading}
              options={[
                { value: "", label: "Select branch" },
                ...options.map((branch) => ({
                  value: branch.id,
                  label: branch.name,
                })),
              ]}
            />
            <TextField
              label="Quantity to relocate"
              type="number"
              min={1}
              max={data.availableQuantity ?? 0}
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Math.max(
                    1,
                    Number.parseInt(
                      (event.target as HTMLInputElement).value,
                      10,
                    ) || 1,
                  ),
                )
              }
            />
          </Grid>
          <Button
            fullWidth
            size="lg"
            className="rounded-2xl h-16 mt-6"
            type="submit"
          >
            Confirm relocation
          </Button>
        </Card>
      </form>
    </div>
  );
};

export default InventoryRelocationPanel;
