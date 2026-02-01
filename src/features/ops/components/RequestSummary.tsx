import React from "react";
import type { BranchResponse } from "@/domains/branch/types";
import type { Product } from "@/domains/catalog/types";

interface RequestSummaryProps {
  selectedBranch: BranchResponse | undefined;
  selectedProduct: Product | undefined;
  requestType: string;
  quantity: number;
}

export const RequestSummary: React.FC<RequestSummaryProps> = ({
  selectedBranch,
  selectedProduct,
  requestType,
  quantity,
}) => {
  if (!selectedBranch || !selectedProduct) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 p-6 rounded-2xl">
      <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-3">
        Request Summary
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Branch:</span>
          <span className="font-semibold text-gray-900">
            {selectedBranch.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Product:</span>
          <span className="font-semibold text-gray-900">
            {selectedProduct.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Action:</span>
          <span className="font-semibold text-gray-900">
            {requestType === "ADD_QUANTITY" ? "Add" : "Set"} {quantity} units
          </span>
        </div>
      </div>
    </div>
  );
};
