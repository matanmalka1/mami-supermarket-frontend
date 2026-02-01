import { SlidersHorizontal, Check } from "lucide-react";
import FilterSection from "@/features/store/category/components/FilterSection";

interface SidebarFiltersProps {
  selectedPrice: string | null;
  preferences: string[];
  handlePriceSelection: (p: string) => void;
  togglePreference: (p: string) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedPrice,
  preferences,
  handlePriceSelection,
  togglePreference,
}) => (
  <aside className="col-span-12 lg:col-span-3 space-y-10">
    <div className="space-y-6">
      <h3 className="text-xl flex items-center gap-3">
        <SlidersHorizontal size={20} className="text-[#008A45]" /> Filter Results
      </h3>
      <div className="space-y-4">
        <FilterSection title="Price Range">
          <div className="space-y-3">
            {["Under ₪20", "₪20 - ₪50", "Over ₪50"].map((p) => (
              <label
                key={p}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  onClick={() => handlePriceSelection(p)}
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedPrice === p ? "border-[#008A45] bg-emerald-50 text-[#008A45]" : "border-gray-200 group-hover:border-[#008A45]"}`}
                >
                  {selectedPrice === p && <Check size={12} strokeWidth={4} />}
                </div>
                <span
                  className={`text-sm font-bold transition-colors ${selectedPrice === p ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}
                >
                  {p}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
        <FilterSection title="Preferences">
          <div className="space-y-3">
            {["Organic", "On Sale", "Gluten Free"].map((p) => (
              <label
                key={p}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  onClick={() => togglePreference(p)}
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${preferences.includes(p) ? "border-[#008A45] bg-emerald-50 text-[#008A45]" : "border-gray-200 group-hover:border-[#008A45]"}`}
                >
                  {preferences.includes(p) && <Check size={12} strokeWidth={4} />}
                </div>
                <span
                  className={`text-sm font-bold transition-colors ${preferences.includes(p) ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}
                >
                  {p}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  </aside>
);

export default SidebarFilters;
