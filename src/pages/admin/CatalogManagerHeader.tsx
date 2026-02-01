import React from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface CatalogManagerHeaderProps {
  totalCount: number;
  onNewProduct: () => void;
}

const CatalogManagerHeader: React.FC<CatalogManagerHeaderProps> = ({
  totalCount,
  onNewProduct,
}) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h1 className="text-4xl  tracking-tight">Catalog Management</h1>
      <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
        Master Product Index • {totalCount} SKUs
      </p>
    </div>
    <Button variant="brand" icon={<Plus size={18} />} onClick={onNewProduct}>
      New Product
    </Button>
  </div>
);

export default CatalogManagerHeader;
