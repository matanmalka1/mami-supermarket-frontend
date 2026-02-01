import React from "react";
import { LayoutGrid, List } from "lucide-react";

interface CategoryViewHeaderProps {
  categoryLabel: string;
  productsCount: number;
  loading: boolean;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const CategoryViewHeader: React.FC<CategoryViewHeaderProps> = ({
  categoryLabel,
  productsCount,
  loading,
  viewMode,
  setViewMode,
}) => (
  <div className="flex items-center justify-between border-b pb-6">
    <div className="flex items-baseline gap-4">
      <h1 className="text-4xl text-gray-900 capitalize">{categoryLabel}</h1>
      {!loading && (
        <span className="text-xs text-gray-300 uppercase tracking-widest">
          {productsCount} Items Found
        </span>
      )}
    </div>
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={viewMode === "grid"}
        onClick={() => setViewMode("grid")}
        className={`p-3 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          viewMode === "grid"
            ? "bg-white border border-gray-100 text-[#008A45] shadow-sm"
            : "bg-gray-50 border border-transparent text-gray-400 hover:border-gray-200 hover:text-gray-600"
        }`}
      >
        <LayoutGrid size={20} />
      </button>
      <button
        type="button"
        aria-pressed={viewMode === "list"}
        onClick={() => setViewMode("list")}
        className={`p-3 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          viewMode === "list"
            ? "bg-white border border-gray-100 text-[#008A45] shadow-sm"
            : "bg-gray-50 border border-transparent text-gray-400 hover:border-gray-200 hover:text-gray-600"
        }`}
      >
        <List size={20} />
      </button>
    </div>
  </div>
);

export default CategoryViewHeader;
