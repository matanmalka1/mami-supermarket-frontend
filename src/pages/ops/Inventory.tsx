import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useBranches } from "@/hooks/useBranches";
import InventoryTable from "@/pages/inventory/InventoryTable";
import InventoryHighlights from "@/pages/inventory/InventoryHighlights";
import NewSkuModal from "@/pages/inventory/NewSkuModal";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import InventoryAnalyticsPanel from "@/pages/inventory/components/InventoryAnalyticsPanel";
import InventoryRelocationPanel from "@/pages/inventory/components/InventoryRelocationPanel";
import StockReportPanel from "@/pages/inventory/components/StockReportPanel";
import { InventoryRow } from "@/types/inventory";

const Inventory: React.FC = () => {
  const { inventory, loading, updateStock, refresh } = useInventory();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [analyticsFocus, setAnalyticsFocus] = useState<InventoryRow | null>(null);
  const [relocationFocus, setRelocationFocus] = useState<InventoryRow | null>(null);
  const { branches, loading: branchesLoading } = useBranches();

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
      <StockReportPanel rows={rows} branches={branches} />

        {loading ? (
          <LoadingState label="Loading global inventory..." />
        ) : rows.length === 0 ? (
          <EmptyState title="No inventory found." description="All branches are currently empty." />
        ) : (
          <InventoryTable
            rows={rows}
            activeMenuId={activeMenuId}
            onMenuToggle={setActiveMenuId}
            onUpdateStock={updateStock}
            onViewAnalytics={(row) => setAnalyticsFocus(row)}
            onViewRelocation={(row) => setRelocationFocus(row)}
          />
        )}

      <NewSkuModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={() => {
          setIsNewModalOpen(false);
          refresh();
        }}
      />

      {relocationFocus && (
        <InventoryRelocationPanel
          data={relocationFocus}
          onClose={() => setRelocationFocus(null)}
          branches={branches}
          branchesLoading={branchesLoading}
        />
      )}

      {analyticsFocus && (
        <InventoryAnalyticsPanel
          data={analyticsFocus}
          onClose={() => setAnalyticsFocus(null)}
        />
      )}

      {activeMenuId && <div className="fixed inset-0 z-[60]" onClick={() => setActiveMenuId(null)} />}
    </div>
  );
};

export default Inventory;
