import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/domains/admin/service";
import type { AdminSettings } from "@/domains/admin/types";

const defaultForm: AdminSettings = {
  deliveryMin: 150,
  deliveryFee: 30,
  slots: "06:00-22:00",
};

// API response type with snake_case fields
type ApiSettingsResponse = {
  delivery_min?: number;
  deliveryMin?: number;
  delivery_fee?: number;
  deliveryFee?: number;
  free_threshold?: number;
  freeThreshold?: number;
  slots?: string;
};

export const useGlobalSettings = () => {
  const [draft, setDraft] = useState<AdminSettings>(defaultForm);
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await adminService.getSettings?.()) as
        | ApiSettingsResponse
        | undefined;
      if (data) {
        const normalized: AdminSettings = {
          deliveryMin: Number(data.delivery_min ?? data.deliveryMin) || 150,
          deliveryFee: Number(data.delivery_fee ?? data.deliveryFee) || 30,
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

  const handleChange = useCallback(
    (key: keyof AdminSettings, value: string) => {
      const nextValue =
        key === "slots" ? value : Math.max(0, Number(value) || 0);
      setDraft((prev) => ({ ...prev, [key]: nextValue }));
    },
    [],
  );

  const saveSettings = useCallback(
    async (payload?: Partial<AdminSettings>) => {
      setLoading(true);
      try {
        const toSave = payload ?? draft;
        const response = (await adminService.updateSettings(toSave)) as
          | ApiSettingsResponse
          | undefined;
        // Update local state with response to ensure sync
        if (response) {
          const normalized: AdminSettings = {
            deliveryMin:
              Number(response.delivery_min ?? response.deliveryMin) ||
              draft.deliveryMin,
            deliveryFee:
              Number(response.delivery_fee ?? response.deliveryFee) ||
              draft.deliveryFee,
            slots: response.slots || draft.slots,
          };
          setDraft(normalized);
        }
      } finally {
        setLoading(false);
      }
    },
    [draft],
  );

  return {
    form: draft,
    settings: draft,
    loading,
    loadSettings,
    handleChange,
    saveSettings,
  };
};
