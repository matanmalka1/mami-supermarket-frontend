import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/domains/admin/service";
import type { AdminSettings } from "@/domains/admin/types";

const defaultForm: AdminSettings = {
  deliveryMin: 150,
  deliveryFee: 30,
  slots: "06:00-22:00",
};

export const useGlobalSettings = () => {
  const [draft, setDraft] = useState<AdminSettings>(defaultForm);
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings?.();
      if (data) {
        const normalized = {
          deliveryMin: Number(data.deliveryMin) || 150,
          deliveryFee: Number(data.deliveryFee) || 30,
          slots: data.slots || "06:00-22:00",
        };
        setDraft(normalized);
      }
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = useCallback((key: keyof AdminSettings, value: string) => {
    const nextValue = key === "slots" ? value : Math.max(0, Number(value) || 0);
    setDraft((prev) => ({ ...prev, [key]: nextValue }));
  }, []);

  const saveSettings = useCallback(async (payload?: Partial<AdminSettings>) => {
    setLoading(true);
    try {
      const toSave = payload ?? draft;
      await adminService.updateSettings(toSave);
    } finally {
      setLoading(false);
    }
  }, [draft]);

  return { form: draft, loading, loadSettings, handleChange, saveSettings };
};
