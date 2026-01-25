import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { BranchResponse, DeliverySlotOption } from "@/types/branch";

type Method = "DELIVERY" | "PICKUP";

export const useCheckoutFlow = () => {
  const { isAuthenticated } = useAuth();
  const [method, setMethod] = useState<Method>("DELIVERY");
  const [serverCartId, setServerCartId] = useState<string | null>(null);
  const [defaultBranch, setDefaultBranch] = useState<BranchResponse | null>(null);
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
    let active = true;
    const loadBranch = async () => {
      try {
        const branches = await apiService.branches.list({ limit: 1 });
        if (active && branches?.length) {
          setDefaultBranch(branches[0]);
        }
      } catch {
        toast.error("Failed to load pickup branch");
      }
    };
    loadBranch();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (method !== "DELIVERY" || !defaultBranch?.id) {
      setDeliverySlots([]);
      setSlotId(null);
      return;
    }

    let active = true;
    const loadSlots = async () => {
      try {
        const data = await apiService.branches.listSlots({ branchId: defaultBranch.id });
        if (!active) return;
        setDeliverySlots(
          data.map((slot) => ({
            id: slot.id,
            label: `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`,
          })),
        );
      } catch {
        toast.error("Failed to load delivery slots");
      }
    };

    loadSlots();
    return () => {
      active = false;
    };
  }, [defaultBranch, method]);

  useEffect(() => {
    if (!serverCartId) {
      setPreview(null);
      return;
    }
    if (method === "PICKUP" && !defaultBranch) {
      setPreview(null);
      return;
    }

    const loadPreview = async () => {
      try {
        const data = await apiService.checkout.preview({
          cart_id: serverCartId,
          fulfillment_type: method,
          branch_id: method === "PICKUP" ? defaultBranch?.id : undefined,
          delivery_slot_id: slotId || undefined,
        });
        setPreview(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load checkout preview");
      }
    };

    loadPreview();
  }, [serverCartId, method, slotId, defaultBranch]);

  return {
    isAuthenticated,
    method,
    setMethod,
    serverCartId,
    defaultBranch,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
  };
};
