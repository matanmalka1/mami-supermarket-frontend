import React, { useState } from "react";
import { Save, Coins } from "lucide-react";
import Button from "@/components/ui/Button";
import Grid from "@/components/ui/Grid";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import SettingsField from "./SettingsField";
import DangerZone from "./DangerZone";
import type { AdminSettings } from "@/domains/admin/types";
import { useGlobalSettings } from "@/features/admin/hooks/useGlobalSettings";

type SettingsPayload = Partial<AdminSettings>;

const GlobalSettings: React.FC = () => {
  const { form, loading, handleChange, saveSettings } = useGlobalSettings();
  const [draft, setDraft] = useState(form);

  React.useEffect(() => {
    setDraft(form);
  }, [form]);

  const updateField = (key: keyof AdminSettings, value: string) => {
    handleChange(key, value);
    setDraft((prev) => ({
      ...prev,
      [key]: key === "slots" ? value : Math.max(0, Number(value) || 0),
    }));
  };
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings(draft);
      toast.success("Settings updated");
    } catch {
      toast.error("Settings push failed");
    }
  };

  const handleSuspendCatalog = () => {
    toast.error("Global Catalog Suspended. All checkout flows halted.", {
      duration: 5000,
    });
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
      <PageHeader
        title="System Config"
        subtitle="Business Logic 2 Master Settings"
        actions={
          <Button
            variant="brand"
            icon={<Save size={18} />}
            className="rounded-2xl h-14 px-10 shadow-xl"
            onClick={handleSave}
            loading={loading}
          >
            Publish Global Changes
          </Button>
        }
      />

      <Grid cols={2} gap={8}>
        <Card variant="default" padding="lg">
          <h3 className="text-xl flex items-center gap-3 text-[#006666]">
            <Coins size={22} /> Delivery Settings
          </h3>
          <div className="space-y-4">
            <SettingsField
              label="Delivery Minimum (₪)"
              value={draft.deliveryMin}
              onChange={(v) => updateField("deliveryMin", v)}
            />
            <SettingsField
              label="Delivery Fee Under Min (₪)"
              value={draft.deliveryFee}
              onChange={(v) => updateField("deliveryFee", v)}
            />
            <SettingsField
              label="Slots Window"
              value={draft.slots}
              onChange={(v) => updateField("slots", v)}
            />
          </div>
        </Card>
        <Card variant="default" padding="lg" className="flex flex-col justify-between">
          <DangerZone
            onSuspend={() => setIsSuspendDialogOpen(true)}
            onFlush={flushCache}
          />
        </Card>
      </Grid>

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
