import React from "react";
import DeliverySlotCard from "./DeliverySlotCard";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

interface DeliverySlotListProps {
  loading: boolean;
  error: string | null;
  slots: any[];
  filteredSlots: any[];
  branchMap: Record<string, string>;
  setEditingSlot: (slot: any) => void;
}

const DeliverySlotList: React.FC<DeliverySlotListProps> = ({
  loading,
  error,
  slots,
  filteredSlots,
  branchMap,
  setEditingSlot,
}) => (
  <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm divide-y">
    {loading ? (
      <LoadingState label="Loading slots..." />
    ) : error ? (
      <ErrorState message={error} />
    ) : slots.length === 0 ? (
      <EmptyState title="No delivery slots available." />
    ) : (
      filteredSlots.map((slot) => {
        const branchId = slot.branchId || slot.branch_id;
        return (
          <DeliverySlotCard
            key={slot.id}
            slot={slot}
            branchName={branchId ? branchMap[branchId] : undefined}
            onEdit={() => setEditingSlot(slot)}
          />
        );
      })
    )}
  </div>
);

export default DeliverySlotList;
