import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useBranchSelection } from "@/context/branch-context-core";
import { DeliverySlotOption, DeliverySlotResponse } from "@/types/branch";

const formatSlotLabel = (slot: DeliverySlotResponse): string | null => {
  if (!slot.startTime || !slot.endTime) return null;
  const start = slot.startTime.substring(0, 5);
  const end = slot.endTime.substring(0, 5);
  const label = `${start} - ${end}`.trim();
  return label || null;
};

const buildUniqueSlotOptions = (slots: DeliverySlotResponse[]): DeliverySlotOption[] => {
  const seen = new Set<string>();
  const options: DeliverySlotOption[] = [];
  slots.forEach((slot) => {
    const label = formatSlotLabel(slot);
    if (!label || seen.has(label)) return;
    seen.add(label);
    options.push({ id: slot.id, label });
  });
  return options.sort((a, b) => a.label.localeCompare(b.label));
};

type Method = "DELIVERY" | "PICKUP";

export const useCheckoutFlow = () => {
  const { isAuthenticated } = useAuth();
  const { selectedBranch } = useBranchSelection();
  const [method, setMethod] = useState<Method>("DELIVERY");
  const [serverCartId, setServerCartId] = useState<string | null>(null);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlotOption[]>([]);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setServerCartId(null);
      return;
    }

    let active = true;
    const loadCart = async () => {
      try {
        const data = await apiService.cart.get();
        if (active) {
          setServerCartId(data?.id || null);
        }
      } catch {
        toast.error("Failed to sync cart with server");
      }
    };

    loadCart();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (method !== "DELIVERY" || !selectedBranch?.id) {
      setDeliverySlots([]);
      setSlotId(null);
      return;
    }
    setSlotId(null);

    let active = true;
    const loadSlots = async () => {
      try {
        const data = await apiService.branches.listSlots({ branchId: selectedBranch.id });
        if (!active) return;
        setDeliverySlots(buildUniqueSlotOptions(data));
      } catch {
        toast.error("Failed to load delivery slots");
      }
    };

    loadSlots();
    return () => {
      active = false;
    };
  }, [method, selectedBranch?.id]);

  useEffect(() => {
    if (!serverCartId) {
      setPreview(null);
      return;
    }
    if (method === "PICKUP" && !selectedBranch) {
      setPreview(null);
      return;
    }

    const loadPreview = async () => {
      try {
        const data = await apiService.checkout.preview({
          cart_id: serverCartId,
          fulfillment_type: method,
          branch_id: method === "PICKUP" ? selectedBranch?.id : undefined,
          delivery_slot_id: slotId || undefined,
        });
        setPreview(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load checkout preview");
      }
    };

    loadPreview();
  }, [serverCartId, method, slotId, selectedBranch]);

  return {
    isAuthenticated,
    method,
    setMethod,
    serverCartId,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
    selectedBranch,
  };
};
