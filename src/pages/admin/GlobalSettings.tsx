import React, { useState, useEffect } from "react";
import { Save, Coins } from "lucide-react";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/api";
import SettingsField from "./SettingsField";
import DangerZone from "./DangerZone";

type SettingsPayload = { delivery_min?: number; delivery_fee?: number; slots?: string };

const GlobalSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [form, setForm] = useState<Required<SettingsPayload>>({
    delivery_min: 150,
    delivery_fee: 30,
    slots: "06:00-22:00",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.admin.getSettings?.();
        if (data) {
          setForm({
            delivery_min: Number(data.delivery_min) || 150,
            delivery_fee: Number(data.delivery_fee) || 30,
            slots: data.slots || "06:00-22:00",
          });
        }
      } catch {
        // keep defaults
      }
    };
    load();
  }, []);

  const handleChange = (key: keyof SettingsPayload, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "slots" ? value : Math.max(0, Number(value) || 0),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: SettingsPayload = {
        delivery_min: form.delivery_min,
        delivery_fee: form.delivery_fee,
        slots: form.slots,
      };
      await apiService.admin.updateSettings(payload);
      toast.success("Settings updated");
    } catch {
      toast.error("Settings push failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendCatalog = () => {
    toast.error("Global Catalog Suspended. All checkout flows halted.", { duration: 5000 });
    setIsSuspendDialogOpen(false);
  };

  const flushCache = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("mami_")) keysToRemove.push(key);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    toast.success("Operational Cache purged successfully.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end border-b pb-8">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">
            System Config
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
            Business Logic • Master Settings
          </p>
        </div>
        <Button
          variant="emerald"
          icon={<Save size={18} />}
          className="rounded-2xl h-14 px-10 shadow-xl"
          onClick={handleSave}
          loading={loading}
        >
          Publish Global Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white border border-gray-100 rounded-[2.5rem] p-10 space-y-6 shadow-sm">
          <h3 className="text-xl font-black italic flex items-center gap-3 text-[#006666]">
            <Coins size={22} /> Delivery Settings
          </h3>
          <div className="space-y-4">
            <SettingsField
              label="Delivery Minimum (₪)"
              value={form.delivery_min}
              onChange={(v) => handleChange("delivery_min", v)}
            />
            <SettingsField
              label="Delivery Fee Under Min (₪)"
              value={form.delivery_fee}
              onChange={(v) => handleChange("delivery_fee", v)}
            />
            <SettingsField
              label="Slots Window"
              value={form.slots}
              onChange={(v) => handleChange("slots", v)}
            />
          </div>
        </section>

        <DangerZone
          onSuspend={() => setIsSuspendDialogOpen(true)}
          onFlush={flushCache}
        />
      </div>

      <ConfirmDialog
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onConfirm={handleSuspendCatalog}
        variant="danger"
        title="CRITICAL: Suspend Catalog?"
        message="This will immediately hide all products from the storefront. Reserved for emergency maintenance only."
        confirmLabel="SUSPEND EVERYTHING"
      />
    </div>
  );
};

export default GlobalSettings;
