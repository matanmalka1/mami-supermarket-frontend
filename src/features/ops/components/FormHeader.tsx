import React from "react";
import { Package } from "lucide-react";

export const FormHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
        <Package className="text-white" size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">New Stock Request</h3>
        <p className="text-sm text-gray-400">
          Request inventory updates for your branch
        </p>
      </div>
    </div>
  );
};
