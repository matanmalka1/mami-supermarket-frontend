import React, { useState } from "react";
import { useParams, Link } from "react-router";
import {
  SlidersHorizontal,
  ChevronRight,
  LayoutGrid,
  List,
  Check,
  Box,
} from "lucide-react";
import ProductCard from "@/screens/Storefront/components/ProductCard";
import ProductGrid from "@/components/store/ProductGrid";
import { useCatalog } from "@/hooks/useCatalog";
import { toast } from "react-hot-toast";
import { useCatalogCategories } from "@/hooks/useCatalogCategories";
import FilterSection from "@/features/store/category/components/FilterSection";
import { Product } from "@/types/domain";

const CategoryView: React.FC = () => {
  const { id } = useParams();
  const categoryId = id ? Number(id) : undefined;
  const { categories } = useCatalogCategories();
  const matchedCategory =
    typeof categoryId === "number"
      ? categories.find((cat) => cat.id === categoryId)
      : undefined;
  const categoryFilter = matchedCategory?.name;
  const { products, loading } = useCatalog(
    categoryFilter ? Number(categoryFilter) : undefined,
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const categoryLabel = matchedCategory?.name || id;

  const togglePreference = (p: string) => {
    setPreferences((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p],
    );
    toast.success(`Filter: ${p} updated`, {
      style: { borderRadius: "1rem", fontWeight: "bold" },
    });
  };

  const priceMatches = (product: Product) => {
    if (!selectedPrice) return true;
    const price = Number(product.price);
    if (Number.isNaN(price)) return true;
    if (selectedPrice === "Under ₪20") return price < 20;
    if (selectedPrice === "₪20 - ₪50") return price >= 20 && price <= 50;
    if (selectedPrice === "Over ₪50") return price > 50;
    return true;
  };

  const preferenceMatches = (product: Product) => {
    if (preferences.length === 0) return true;
    return preferences.every((pref) => {
      const normalized = pref.toLowerCase();
      if (normalized === "organic") {
        return (
          product.category?.toLowerCase().includes("organic") ||
          product.description?.toLowerCase().includes("organic")
        );
      }
      if (normalized === "on sale") {
        return !!(
          product.oldPrice &&
          product.price &&
          Number(product.oldPrice) > Number(product.price)
        );
      }
      if (normalized === "gluten free") {
        return (
          product.description?.toLowerCase().includes("gluten-free") ||
          product.description?.toLowerCase().includes("gluten free")
        );
      }
      return true;
    });
  };

  const filteredProducts = products.filter(
    (item: Product) => priceMatches(item) && preferenceMatches(item),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
        <Link to="/store" className="hover:text-[#008A45]">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#008A45]">Categories</span>
        <ChevronRight size={12} />
        <span className="text-gray-900 capitalize">{categoryLabel}</span>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Sidebar Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-10">
          <div className="space-y-6">
            <h3 className="text-xl font-black italic flex items-center gap-3">
              <SlidersHorizontal size={20} className="text-[#008A45]" /> Filter
              Results
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
                        onClick={() =>
                          setSelectedPrice(selectedPrice === p ? null : p)
                        }
                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedPrice === p ? "border-[#008A45] bg-emerald-50 text-[#008A45]" : "border-gray-200 group-hover:border-[#008A45]"}`}
                      >
                        {selectedPrice === p && (
                          <Check size={12} strokeWidth={4} />
                        )}
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
                        {preferences.includes(p) && (
                          <Check size={12} strokeWidth={4} />
                        )}
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

        {/* Product Grid */}
        <main className="col-span-12 lg:col-span-9 space-y-8">
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl font-black italic text-gray-900 capitalize">
                {categoryLabel}
              </h1>
              {!loading && (
                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">
                  {products.length} Items Found
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 bg-white border border-gray-100 rounded-xl text-[#008A45] shadow-sm">
                <LayoutGrid size={20} />
              </button>
              <button className="p-3 bg-gray-50 border border-transparent rounded-xl text-gray-400">
                <List size={20} />
              </button>
            </div>
          </div>

          <ProductGrid
            loading={loading}
            products={filteredProducts}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700"
            renderItem={(item: Product) => (
              <ProductCard
                item={{ ...item, tag: item.status, image: item.imageUrl }}
              />
            )}
          />
          {!loading && filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto">
                <Box size={32} />
              </div>
              <p className="font-black italic text-gray-300 uppercase tracking-widest">
                Aisle Empty in this Department
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryView;
