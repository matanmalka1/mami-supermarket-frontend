import React from "react";
import { AlertTriangle } from "lucide-react";

export const RequestTypeInfo: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-sm text-amber-800 flex gap-3">
      <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold mb-1">Important</p>
        <p className="text-amber-700">
          <strong>ADD_QUANTITY:</strong> Increases current stock by specified
          amount.
          <br />
          <strong>SET_QUANTITY:</strong> Sets stock to exact specified amount.
        </p>
      </div>
    </div>
  );
};
