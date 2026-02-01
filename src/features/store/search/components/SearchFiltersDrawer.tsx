import React from "react";
import { X, Check } from "lucide-react";
import Button from "@/components/ui/Button";

const sortOptions = [
  "Relevance",
  "Price: Low to High",
  "Price: High to Low",
  "Newest Arrivals",
];
const preferenceOptions = [
  "Organic Only",
  "Gluten Free",
  "Vegan friendly",
  "On Flash Sale",
];

type SearchFiltersDrawerProps = {
  isOpen: boolean;
  activeSort: string;
  activePrefs: string[];
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onSetSort: (value: string) => void;
  onTogglePref: (pref: string) => void;
};

const SearchFiltersDrawer: React.FC<SearchFiltersDrawerProps> = ({
  isOpen,
  activeSort,
  activePrefs,
  onClose,
  onApply,
  onClear,
  onSetSort,
  onTogglePref,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b flex items-center justify-between">
          <h2 className="text-2xl ">Refine Search</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <FilterGroup title="Sort By">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => onSetSort(option)}
                className={`w-full text-left py-2 text-sm font-bold transition-colors flex items-center justify-between ${activeSort === option ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"}`}
              >
                {option}
                {activeSort === option && <Check size={14} />}
              </button>
            ))}
          </FilterGroup>
          <FilterGroup title="Dietary & Preferences">
            {preferenceOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  onClick={() => onTogglePref(option)}
                  className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${activePrefs.includes(option) ? "border-emerald-500 bg-emerald-50" : "border-gray-200 group-hover:border-emerald-500"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-sm bg-emerald-500 transition-transform ${activePrefs.includes(option) ? "scale-100" : "scale-0"}`}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${activePrefs.includes(option) ? "text-gray-900" : "text-gray-600"}`}
                >
                  {option}
                </span>
              </label>
            ))}
          </FilterGroup>
        </div>
        <div className="p-8 bg-gray-50 border-t flex gap-4">
          <Button variant="ghost" className="flex-1" onClick={onClear}>
            Clear All
          </Button>
          <Button
            variant="brand"
            className="flex-[2] rounded-2xl "
            onClick={onApply}
          >
            Apply Filters
          </Button>
        </div>
      </aside>
    </div>
  );
};

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-4">
    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
      {title}
    </h4>
    <div className="space-y-3">{children}</div>
  </div>
);

export default SearchFiltersDrawer;
