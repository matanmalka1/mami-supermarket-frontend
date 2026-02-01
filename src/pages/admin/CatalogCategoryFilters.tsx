import React from "react";

interface CatalogCategoryFiltersProps {
  categoryFilters: { id: string | number; name: string }[];
  activeFilter: string | number;
  setActiveFilter: (id: string | number) => void;
}

const CatalogCategoryFilters: React.FC<CatalogCategoryFiltersProps> = ({
  categoryFilters,
  activeFilter,
  setActiveFilter,
}) => (
  <div className="flex gap-4 text-[10px] text-gray-300 uppercase tracking-widest overflow-x-auto">
    {categoryFilters.map((cat) => (
      <button
        key={cat.id}
        onClick={() => setActiveFilter(cat.id)}
        className={`transition-all whitespace-nowrap ${
          activeFilter === cat.id ? "text-[#006666]" : "hover:text-[#006666]"
        }`}
      >
        {cat.name || "All"}
      </button>
    ))}
  </div>
);

export default CatalogCategoryFilters;
