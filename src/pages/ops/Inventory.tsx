import React, { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import InventoryTable from "@/pages/inventory/InventoryTable";
import InventoryHighlights from "@/pages/inventory/InventoryHighlights";
import NewSkuModal from "@/pages/inventory/NewSkuModal";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";

const Inventory: React.FC = () => {
  const { inventory, loading, updateStock } = useInventory();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const rows = inventory;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Inventory Control</h1>
          <p className="text-sm text-gray-500 mt-1 font-bold uppercase tracking-widest">
            Global Stock Monitoring • Phase 2 Nodes
          </p>
        </div>
        <Button
          variant="primary"
          className="rounded-2xl h-14 px-8"
          icon={<Plus size={20} />}
          onClick={() => setIsNewModalOpen(true)}
        >
          New SKU
        </Button>
      </div>

      <InventoryHighlights rows={rows} />

      {loading ? (
        <LoadingState label="Loading global inventory..." />
      ) : rows.length === 0 ? (
        <EmptyState title="No inventory found." description="All branches are currently empty." />
      ) : (
        <InventoryTable rows={rows} activeMenuId={activeMenuId} onMenuToggle={setActiveMenuId} onUpdateStock={updateStock} />
      )}

      <NewSkuModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />

      {activeMenuId && <div className="fixed inset-0 z-[60]" onClick={() => setActiveMenuId(null)} />}
    </div>
  );
};

export default Inventory;
