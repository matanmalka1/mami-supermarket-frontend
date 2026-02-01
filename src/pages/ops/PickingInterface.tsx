import { useState } from "react";
import { toast } from "react-hot-toast";
import { usePicking } from "@/features/ops/hooks/usePicking";
import { useWeightScale } from "@/hooks/useWeightScale";
import { useParams, useNavigate } from "react-router";
import { opsService } from "@/domains/ops/service";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import PickingFinalizedNotice from "@/pages/ops/components/PickingFinalizedNotice";
import PickingWorkflowLayout from "@/pages/ops/components/PickingWorkflowLayout";
const PickingInterface: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    order,
    items,
    loading,
    error,
    progress,
    updateItemStatus,
    refresh,
    isFinalized,
  } = usePicking(id);
  const {
    weighingItem,
    setWeighingItem,
    currentWeight,
    setManualWeight,
    resetScale,
    isSimulated,
  } = useWeightScale();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [missingItemId, setMissingItemId] = useState<string | number | null>(null);

  const handleToggleRow = (rowId: number) => {
    setExpandedId((prev) => (prev === rowId ? null : rowId));
  };
  const handleUpdateStatus = async (
    itemId: string | number,
    status: string,
    reason?: string,
    replacement?: any,
  ) => {
    try {
      if (status === "PICKED") {
        const item = items.find((i) => i.id === itemId);
        if (
          item?.product?.category?.toLowerCase().includes("produce") &&
          !weighingItem
        ) {
          setWeighingItem(item);
          return;
        }
      }
      await updateItemStatus(itemId, status, reason, replacement?.id);
      setMissingItemId(null);
      resetScale();
      toast.success(status === "PICKED" ? "Item confirmed" : "Shortage logged");
    } catch {
      // Error handled in hook
    }
  };
  const handleReportDamage = async (
    itemId: string | number,
    reason: string,
    notes?: string,
  ) => {
    if (!order) return;
    try {
      await opsService.reportDamage(
        Number(order.id),
        Number(itemId),
        { reason, notes },
      );
      await updateItemStatus(itemId, "MISSING", reason);
      toast.success("Damage report submitted");
    } catch (err: any) {
      toast.error(err.message || "Failed to report damage");
      throw err;
    }
  };
  const handleWeightConfirm = () => {
    if (weighingItem) {
      handleUpdateStatus(weighingItem.id, "PICKED");
    }
  };
  if (loading) {
    return (
      <LoadingState label="Loading picking data..." />
    );
  }
  if (error) {
    return (
      <ErrorState message={error} onRetry={refresh} />
    );
  }

  if (order && isFinalized) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-6xl mx-auto">
          <PickingFinalizedNotice
            orderNumber={order.orderNumber}
            status={order.status}
            onBack={() => navigate("/")}
          />
        </div>
      </div>
    );
  }
  return (
    <>
      {order && (
        <PickingWorkflowLayout
          order={order}
          items={items}
          expandedId={expandedId}
          missingItemId={missingItemId}
          onToggleRow={handleToggleRow}
          onUpdateStatus={handleUpdateStatus}
          onReportMissing={(id) => setMissingItemId(id)}
          onReportDamage={handleReportDamage}
          onBack={() => navigate("/")}
          onWeightConfirm={handleWeightConfirm}
          weighingItem={weighingItem}
          resetScale={resetScale}
          setManualWeight={setManualWeight}
          currentWeight={currentWeight}
          isSimulated={isSimulated}
          progress={progress}
          onSync={refresh}
          onComplete={() => navigate("/")}
          setMissingItemId={setMissingItemId}
        />
      )}
    </>
  );
};

export default PickingInterface;
