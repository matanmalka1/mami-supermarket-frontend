import React from "react";
import { Box } from "lucide-react";
import IconBox from "@/components/ui/IconBox";

const CategoryViewEmpty: React.FC = () => (
  <div className="py-20 text-center space-y-4">
    <IconBox size="xl" className="bg-gray-50 rounded-2xl text-gray-200 mx-auto">
      <Box size={32} />
    </IconBox>
    <p className="text-gray-300 uppercase tracking-widest">
      Aisle Empty in this Department
    </p>
  </div>
);

export default CategoryViewEmpty;
