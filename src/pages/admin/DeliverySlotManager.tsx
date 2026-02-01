import React, { useEffect, useMemo, useState } from "react";
import DeliverySlotManagerHeader from "./DeliverySlotManagerHeader";
import DeliverySlotManagerFilters from "./DeliverySlotManagerFilters";
import DeliverySlotList from "./DeliverySlotList";
import DeliverySlotEditor from "./DeliverySlotEditor";
import { toast } from "react-hot-toast";
import { useDeliverySlots } from "@/features/admin/hooks/useDeliverySlots";

const DeliverySlotManager: React.FC = () => {
  const [editingSlot, setEditingSlot] = useState<any | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const { slots, setSlots, branches, loading, error, refreshSlots } =
    useDeliverySlots();

  const handleSave = async () => {
    await refreshSlots();
    toast.success("Delivery slots refreshed");
  };

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const branchMatches = selectedBranch
        ? (slot.branchId || slot.branch_id) === selectedBranch
        : true;
      const slotDay = String(
        slot.dayOfWeek ?? slot.day_of_week ?? "",
      ).toLowerCase();
      const dayMatches = selectedDay ? slotDay === selectedDay : true;
      return branchMatches && dayMatches;
    });
  }, [slots, selectedBranch, selectedDay]);

  const branchMap = useMemo(
    () =>
      branches.reduce<Record<string, string>>((acc, branch) => {
        acc[branch.id] = branch.name;
        return acc;
      }, {}),
    [branches],
  );
  const availableDays = useMemo(() => {
    const days = new Set<number>();
    slots.forEach((slot) => {
      const day = slot.dayOfWeek ?? slot.day_of_week;
      if (typeof day === "number") days.add(day);
    });
    return Array.from(days).sort((a, b) => a - b);
  }, [slots]);

  const availableBranches = useMemo(() => {
    const branchIds = new Set<string>();
    slots.forEach((slot) => {
      const branchId = slot.branchId || slot.branch_id;
      if (branchId) branchIds.add(branchId);
    });
    return branches.filter((branch) => branchIds.has(String(branch.id)));
  }, [slots, branches]);

  useEffect(() => {
    if (!selectedBranch && availableBranches.length) {
      setSelectedBranch(String(availableBranches[0].id));
    }
    if (!availableBranches.length) {
      setSelectedBranch("");
    }
  }, [availableBranches, selectedBranch]);

  useEffect(() => {
    if (!selectedDay && availableDays.length) {
      setSelectedDay(String(availableDays[0]));
    }
    if (!availableDays.length) {
      setSelectedDay("");
    }
  }, [availableDays, selectedDay]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <DeliverySlotManagerHeader onSave={handleSave} />
      <DeliverySlotManagerFilters
        availableBranches={availableBranches}
        availableDays={availableDays}
        selectedBranch={selectedBranch}
        selectedDay={selectedDay}
        setSelectedBranch={setSelectedBranch}
        setSelectedDay={setSelectedDay}
      />
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <DeliverySlotList
            loading={loading}
            error={error}
            slots={slots}
            filteredSlots={filteredSlots}
            branchMap={branchMap}
            setEditingSlot={setEditingSlot}
          />
        </div>
      </div>
      <DeliverySlotEditor
        slot={editingSlot}
        isOpen={Boolean(editingSlot)}
        onClose={() => setEditingSlot(null)}
        onSave={(updated) => {
          setSlots((prev) =>
            prev.map((slot) => (slot.id === updated.id ? updated : slot)),
          );
        }}
      />
    </div>
  );
};

export default DeliverySlotManager;
