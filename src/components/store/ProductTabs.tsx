import { useState } from "react";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { Product } from "@/domains/catalog/types";
import EmptyState from "@/components/ui/EmptyState";

const ProductTabs: React.FC<{ product?: Product | null }> = ({ product }) => {
  const [activeTab, setActiveTab] = useState("Specifications");

  const specs = product
    ? [
        { label: "SKU", value: product.sku },
        { label: "Category", value: product.category },
        { label: "Available Qty", value: String(product.availableQuantity) },
        { label: "Reserved Qty", value: String(product.reservedQuantity) },
      ]
    : [];

  const renderContent = () => {
    switch (activeTab) {
      case "Specifications":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {specs.length === 0 ? (
              <EmptyState title="No specs available." />
            ) : (
              specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 md:border-0"
                >
                  <span className="text-sm font-medium text-gray-400">
                    {spec.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {spec.value}
                  </span>
                </div>
              ))
            )}
          </div>
        );
      case "Details & Care":
        return (
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-gray-600 leading-relaxed font-medium">
              {product?.description || "No additional details provided."}
            </p>
            {product && (
              <div className="flex gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <ShieldCheck className="text-emerald-600 mb-2" size={20} />
                  <p className="text-[10px] uppercase">Quality Assured</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <RefreshCcw className="text-blue-600 mb-2" size={20} />
                  <p className="text-[10px] uppercase">Returns info pending</p>
                </div>
              </div>
            )}
          </div>
        );
      case "Shipping & Returns":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Shipping</p>
                <p className="text-sm text-gray-500 font-medium">
                  Shipping details pending backend support.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                <RefreshCcw size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Returns</p>
                <p className="text-sm text-gray-500 font-medium">
                  Returns policy not connected to backend yet.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border-t border-gray-100 pt-12">
      <div className="flex gap-12 border-b border-gray-50 mb-12 overflow-x-auto no-scrollbar whitespace-nowrap">
        {["Specifications", "Details & Care", "Shipping & Returns"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab
                  ? "text-emerald-600"
                  : "text-gray-300 hover:text-gray-500"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ),
        )}
      </div>
      <div className="min-h-[200px]">{renderContent()}</div>
    </div>
  );
};

export default ProductTabs;
