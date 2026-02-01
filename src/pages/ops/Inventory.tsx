import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useInventory } from "@/features/admin/hooks/useInventory";
import { useBranches } from "@/hooks/useBranches";
import InventoryTable from "@/pages/inventory/InventoryTable";
import InventoryHighlights from "@/pages/inventory/InventoryHighlights";
import NewSkuModal from "@/pages/inventory/NewSkuModal";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import InventoryAnalyticsPanel from "@/pages/inventory/components/InventoryAnalyticsPanel";
import InventoryRelocationPanel from "@/pages/inventory/components/InventoryRelocationPanel";
import StockReportPanel from "@/pages/inventory/components/StockReportPanel";
import { InventoryRow } from "@/domains/inventory/types";

const Inventory: React.FC = () => {
  const { inventory, loading, refresh } = useInventory();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [analyticsFocus, setAnalyticsFocus] = useState<InventoryRow | null>(
    null,
  );
  const [relocationFocus, setRelocationFocus] = useState<InventoryRow | null>(
    null,
  );
  const { branches, loading: branchesLoading } = useBranches();

  const rows = inventory;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500 relative max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl border border-gray-100">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Inventory Control
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-wider">
            Multi-Branch Stock Management System
          </p>
        </div>
        <Button
          variant="primary"
          className="rounded-2xl h-14 px-8 shadow-lg shadow-teal-900/10"
          icon={<Plus size={20} />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Add New SKU
        </Button>
      </div>

      {loading ? (
        <LoadingState label="Loading global inventory..." />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No inventory found."
          description="All branches are currently empty."
        />
      ) : (
        <>
          {/* Stats Overview */}
          <InventoryHighlights rows={rows} />

          {/* Main Inventory Table with Filters */}
          <StockReportPanel rows={rows} branches={branches} />
        </>
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

      {activeMenuId && (
        <div
          className="fixed inset-0 z-[60]"
          onClick={() => setActiveMenuId(null)}
        />
      )}
    </div>
  );
};

export default Inventory;
