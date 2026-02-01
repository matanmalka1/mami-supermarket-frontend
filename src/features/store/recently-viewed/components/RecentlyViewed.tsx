import React, { useState, useEffect } from "react";
import { History, ArrowRight } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { toast } from "react-hot-toast";

const RECENTLY_VIEWED_KEY = "mami_recent_items";

const loadRecentlyViewedItems = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item?.id === "number");
  } catch {
    return [];
  }
};

const RecentlyViewed: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(loadRecentlyViewedItems());
  }, []);

  const handleClear = () => {
    setItems([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    toast.success("History cleared", {
      style: { borderRadius: "1rem", fontWeight: "bold" },
    });
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-2xl text-gray-900 ">Recently Viewed</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Pick up where you left off
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="text-gray-400 hover:text-[#008A45] text-xs uppercase tracking-widest flex items-center gap-2 group transition-all"
        >
          Clear History{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
      {items.length === 0 ? (
        <div className="text-center text-gray-400 font-bold py-6">
          No recently viewed items yet.
        </div>
      ) : (
        <div className="flex gap-10 overflow-x-auto pb-4 no-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="min-w-[280px]">
              <ProductCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentlyViewed;
