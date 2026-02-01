import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/domains/admin/service";
import type { AdminSettings } from "@/domains/admin/types";

const defaultForm: AdminSettings = {
  deliveryMin: 150,
  deliveryFee: 30,
  slots: "06:00-22:00",
};

export const useGlobalSettings = () => {
  const [form, setForm] = useState<AdminSettings>(defaultForm);
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings?.();
      if (data) {
        setForm({
          deliveryMin: Number(data.deliveryMin) || 150,
          deliveryFee: Number(data.deliveryFee) || 30,
          slots: data.slots || "06:00-22:00",
        });
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
    setForm((prev) => ({
      ...prev,
      [key]: key === "slots" ? value : Math.max(0, Number(value) || 0),
    }));
  }, []);

  const saveSettings = useCallback(async () => {
    setLoading(true);
    try {
      await adminService.updateSettings(form);
    } finally {
      setLoading(false);
    }
  }, [form]);

  return { form, loading, loadSettings, handleChange, saveSettings };
};
