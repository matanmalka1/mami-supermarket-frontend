import React from "react";
import Badge from "@/components/ui/Badge";
import { currencyILS } from "@/utils/format";
import { Edit3, Trash2 } from "lucide-react";

type Props = {
  products: any[];
  loading: boolean;
  onEdit: (p: any) => void;
  onDeactivate: (p: any) => void;
};

const CatalogProductTable: React.FC<Props> = ({ products, loading, onEdit, onDeactivate }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50/50 text-[10px] text-gray-400 uppercase font-black tracking-widest border-b">
          <tr>
            <th className="px-8 py-6">Product Information</th>
            <th className="px-6 py-6">Bin Location</th>
            <th className="px-6 py-6">Status</th>
            <th className="px-6 py-6 text-right">Price</th>
            <th className="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm font-bold">
          {loading && (
            <tr>
              <td colSpan={5} className="p-20 text-center text-gray-300 animate-pulse uppercase tracking-[0.3em]">
                Syncing Global Index...
              </td>
            </tr>
          )}
          {!loading && products.length === 0 && (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-400 font-bold uppercase tracking-[0.25em]">
                No products found
              </td>
            </tr>
          )}
          {!loading &&
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {product.imageUrl || product.image_url ? (
                      <img src={product.imageUrl || product.image_url} className="w-12 h-12 rounded-xl object-cover border" alt="" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border flex items-center justify-center text-gray-400 font-black">
                        {(product.name || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-gray-900 text-lg leading-tight italic">{product.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <Badge color="blue">{product.binLocation || "A-00"}</Badge>
                </td>
                <td className="px-6 py-6">
                  <Badge color={product.availableQuantity > 50 ? "emerald" : "orange"}>
                    {product.availableQuantity > 50 ? "Steady" : "Low Stock"}
                  </Badge>
                </td>
                <td className="px-6 py-6 text-right font-black italic text-gray-900">
                  {currencyILS(product.price)}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(product)} className="p-2 border rounded-lg text-gray-400 hover:text-[#006666]">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => onDeactivate(product)} className="p-2 border rounded-lg text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CatalogProductTable;
