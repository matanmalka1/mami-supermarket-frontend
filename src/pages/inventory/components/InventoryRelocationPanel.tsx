import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import { InventoryRow } from "@/domains/inventory/types";
import type { BranchResponse } from "@/domains/branch/types";

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
        className="relative z-10 w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
              Relocation
            </p>
            <h2 className="text-2xl font-black  text-gray-900">
              {productName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-black uppercase tracking-[0.4em] text-gray-400"
          >
            Cancel
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Current branch
          </label>
          <p className="text-lg font-black">{currentBranch}</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Destination branch
          </label>
          <select
            value={targetBranch}
            onChange={(event) => setTargetBranch(event.target.value)}
            disabled={branchesLoading}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold appearance-none"
          >
            <option value="">Select branch</option>
            {options.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Quantity to relocate
          </label>
          <input
            type="number"
            min={1}
            max={data.availableQuantity ?? 0}
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Math.max(1, Number.parseInt(event.target.value, 10) || 1),
              )
            }
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold"
          />
        </div>

        <Button fullWidth size="lg" className="rounded-2xl h-16" type="submit">
          Confirm relocation
        </Button>
      </form>
    </div>
  );
};

export default InventoryRelocationPanel;
