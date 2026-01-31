import React from "react";
import { Box } from "lucide-react";

const CategoryViewEmpty: React.FC = () => (
  <div className="py-20 text-center space-y-4">
    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto">
      <Box size={32} />
    </div>
    <p className="text-gray-300 uppercase tracking-widest">
      Aisle Empty in this Department
    </p>
  </div>
);

export default CategoryViewEmpty;
