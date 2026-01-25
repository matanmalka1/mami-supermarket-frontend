import React, { FormEvent, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { adminService } from "@/services/admin-service";
import type { DeliverySlot } from "@/features/admin/deliverySlots/types";

type Props = {
  slot: DeliverySlot | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: DeliverySlot) => void;
};

const DeliverySlotEditor: React.FC<Props> = ({ slot, isOpen, onClose, onSave }) => {
  const [saving, setSaving] = useState(false);
  const initialStart = slot?.startTime || slot?.start_time || "";
  const initialEnd = slot?.endTime || slot?.end_time || "";
  const initialDay = slot?.dayOfWeek ?? slot?.day_of_week ?? 0;
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [dayOfWeek, setDayOfWeek] = useState(initialDay.toString());
  const [isActive, setIsActive] = useState(slot?.is_active !== false);

  useMemo(() => {
    if (slot) {
      setStartTime(slot.startTime || slot.start_time || "");
      setEndTime(slot.endTime || slot.end_time || "");
      setDayOfWeek((slot.dayOfWeek ?? slot.day_of_week ?? 0).toString());
      setIsActive(slot.is_active !== false);
    }
  }, [slot]);

  if (!slot) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const day = parseInt(dayOfWeek, 10);
      await adminService.updateDeliverySlot(slot.id, {
        start_time: startTime,
        end_time: endTime,
        day_of_week: Number.isFinite(day) ? day : slot.day_of_week,
        branch_id: slot.branchId || slot.branch_id,
      });
      if (slot.is_active !== isActive) {
        await adminService.toggleDeliverySlot(slot.id, isActive);
      }
      const updated: DeliverySlot = {
        ...slot,
        start_time: startTime,
        startTime: startTime,
        end_time: endTime,
        endTime: endTime,
        day_of_week: day,
        dayOfWeek: day,
        is_active: isActive,
      };
      toast.success("Slot saved");
      onSave(updated);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit delivery slot"
      subtitle="Update the window and activation status"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1 text-xs uppercase font-black tracking-[0.3em] text-gray-500">
            Start time
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-base font-bold outline-none"
            />
          </label>
          <label className="space-y-1 text-xs uppercase font-black tracking-[0.3em] text-gray-500">
            End time
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-base font-bold outline-none"
            />
          </label>
        </div>
        <label className="space-y-1 text-xs uppercase font-black tracking-[0.3em] text-gray-500">
          Day of week (0=Sun)
          <input
            type="number"
            min={0}
            max={6}
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-base font-bold outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Slot active
        </label>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Save slot"}
        </Button>
      </form>
    </Modal>
  );
};

export default DeliverySlotEditor;
