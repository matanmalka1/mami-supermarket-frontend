import React, { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import DeliverySlotCard from "./DeliverySlotCard";
import DeliverySlotEditor from "./DeliverySlotEditor";
import { Save } from "lucide-react";
import { toast } from "react-hot-toast";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import { useDeliverySlots } from "@/features/admin/hooks/useDeliverySlots";

const DeliverySlotManager: React.FC = () => {
  const [editingSlot, setEditingSlot] = useState<any | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const { slots, branches, loading, error, refreshSlots } = useDeliverySlots();

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">
            Fulfillment Config
          </h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
            Branch Delivery Slots
          </p>
        </div>
        <Button
          variant="emerald"
          icon={<Save size={18} />}
          className="rounded-2xl h-14 px-10 shadow-xl shadow-emerald-900/10"
          onClick={handleSave}
        >
          Publish Changes
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
          Filter by branch
        </label>
        {availableBranches.length > 0 ? (
          <select
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm text-gray-600">
            No branch
          </div>
        )}
        <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
          Day of week
        </label>
        {availableDays.length > 0 ? (
          <select
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {availableDays.map((day) => (
              <option key={day} value={String(day)}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
              </option>
            ))}
          </select>
        ) : (
          <div className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm text-gray-600">
            Day
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-8">
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
