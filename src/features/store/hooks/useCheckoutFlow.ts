// This is the content of useCheckoutFlow.ts
// Removed duplicate minimal stub. Only the full-featured hook below remains.
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useBranchSelection } from "@/context/branch-context-core";
import {
  DeliverySlotOption,
  DeliverySlotResponse,
} from "@/domains/branch/types";
import { cartService } from "@/domains/cart/service";
import { checkoutService } from "@/domains/checkout/service";
import { branchService } from "@/domains/branch/service";

const formatSlotLabel = (slot: DeliverySlotResponse): string | null => {
  if (!slot.startTime || !slot.endTime) return null;
  const start = slot.startTime.substring(0, 5);
  const end = slot.endTime.substring(0, 5);
  const label = `${start} - ${end}`.trim();
  return label || null;
};

const buildUniqueSlotOptions = (
  slots: DeliverySlotResponse[],
): DeliverySlotOption[] => {
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

type BranchSlotsClient = {
  listSlots: (params: {
    branchId: string | number;
  }) => Promise<DeliverySlotResponse[]>;
};

const branchSlotsService = branchService as BranchSlotsClient;

export const useCheckoutFlow = () => {
  const { isAuthenticated } = useAuth();
  const { selectedBranch } = useBranchSelection();
  const [method, setMethod] = useState<Method>("DELIVERY");
  const [serverCartId, setServerCartId] = useState<string | number | null>(
    null,
  );
  const [cartIdLoading, setCartIdLoading] = useState(true);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlotOption[]>([]);
  const [slotId, setSlotId] = useState<number | null>(null);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setServerCartId(null);
      setCartIdLoading(false);
      return;
    }

    let active = true;
    setCartIdLoading(true);
    const loadCart = async () => {
      try {
        const data = await cartService.get();
        if (active) {
          setServerCartId(data?.id ?? null);
        }
      } catch {
        toast.error("Failed to sync cart with server");
      } finally {
        if (active) {
          setCartIdLoading(false);
        }
      }
    };

    loadCart();

    const handleFocus = () => {
      if (active) loadCart();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedBranch?.id) {
      setDeliverySlots([]);
      setSlotId(null);
      return;
    }
    setSlotId(null);

    let active = true;
    const loadSlots = async () => {
      try {
        const data = await branchSlotsService.listSlots({
          branchId: String(selectedBranch.id),
        });
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
        const data = await checkoutService.preview({
          cartId: serverCartId,
          fulfillmentType: method,
          branchId: method === "PICKUP" ? selectedBranch?.id : undefined,
          deliverySlotId: slotId ?? undefined,
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
    cartIdLoading,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
    selectedBranch,
  };
};
