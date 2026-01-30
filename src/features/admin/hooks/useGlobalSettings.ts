import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/domains/admin/service";
import type { AdminSettings } from "@/domains/admin/types";

type SettingsPayload = Partial<AdminSettings>;
const defaultForm: Required<SettingsPayload> = {
  delivery_min: 150,
  delivery_fee: 30,
  slots: "06:00-22:00",
};

export const useGlobalSettings = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings?.();
      if (data) {
        setForm({
          delivery_min: Number(data.delivery_min) || 150,
          delivery_fee: Number(data.delivery_fee) || 30,
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

  const handleChange = useCallback(
    (key: keyof SettingsPayload, value: string) => {
      setForm((prev: Required<SettingsPayload>) => ({
        ...prev,
        [key]: key === "slots" ? value : Math.max(0, Number(value) || 0),
      }));
    },
    [],
  );

  const saveSettings = useCallback(async () => {
    setLoading(true);
    try {
      const payload: SettingsPayload = {
        delivery_min: form.delivery_min,
        delivery_fee: form.delivery_fee,
        slots: form.slots,
      };
      await adminService.updateSettings(payload);
    } finally {
      setLoading(false);
    }
  }, [form]);

  return { form, loading, loadSettings, handleChange, saveSettings };
};
