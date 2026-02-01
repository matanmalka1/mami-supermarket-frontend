import React from "react";
import Badge from "@/components/ui/Badge";
import { currencyILS } from "@/utils/format";
import { Edit3, Trash2 } from "lucide-react";
import BaseTable, { type ColumnDefinition } from "@/components/ui/BaseTable";

type Product = {
  id: React.Key;
  name?: string;
  sku?: string;
  price?: number;
  binLocation?: string;
  availableQuantity?: number;
  imageUrl?: string;
  image_url?: string;
};

type Props = {
  products: Product[];
  loading: boolean;
  onEdit: (p: Product) => void;
  onDeactivate: (p: Product) => void;
};

const columnDefinitions: ColumnDefinition<Product>[] = [
  { header: "Product Information" },
  { header: "Status", className: "text-center" },
  { header: "Price", className: "text-right" },
  { header: "Actions", className: "text-right" },
];

const CatalogProductTable: React.FC<Props> = ({
  products,
  loading,
  onEdit,
  onDeactivate,
}) => (
  <BaseTable
    data={products}
    columns={columnDefinitions}
    isLoading={loading}
    loadingLabel="Syncing Global Index..."
    emptyLabel="No products found"
    rowKey={(product) => product.id}
    renderRow={(product) => (
      <tr className="hover:bg-gray-50/50 transition-colors group">
        <td className="px-8 py-6">
          <div className="flex items-center gap-4">
            {product.imageUrl || product.image_url ? (
              <img
                src={product.imageUrl || product.image_url}
                className="w-12 h-12 rounded-xl object-cover border"
                alt=""
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gray-100 border flex items-center justify-center text-gray-400 ">
                {(product.name || "?").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-gray-900 text-lg leading-tight ">
                {product.name}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                SKU: {product.sku}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-6 text-center">
          <Badge
            color={(product.availableQuantity ?? 0) > 50 ? "emerald" : "orange"}
          >
            {(product.availableQuantity ?? 0) > 50 ? "Steady" : "Low Stock"}
          </Badge>
        </td>
        <td className="px-6 py-6 text-right  text-gray-900">
          {currencyILS(product.price ?? 0)}
        </td>
        <td className="px-8 py-6 text-right">
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(product)}
              className="p-2 border rounded-lg text-gray-400 hover:text-[#006666]"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDeactivate(product)}
              className="p-2 border rounded-lg text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    )}
  />
);

export default CatalogProductTable;
