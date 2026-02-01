import React from "react";

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4">
    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
      {title}
    </h4>
    {children}
  </div>
);

export default FilterSection;
