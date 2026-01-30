import { useCallback, useState } from "react";
import { useCheckoutFlow } from "@/features/store/hooks/useCheckoutFlow";
import { checkoutService } from "@/domains/checkout/service";
import { useCart } from "@/context/cart-context";
import type {
  OrderSuccessSnapshot,
  OrderSuccessFulfillment,
} from "@/domains/orders/types";

export const useCheckoutProcess = () => {
  const {
    isAuthenticated,
    method,
    setMethod,
    serverCartId,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
    selectedBranch,
  } = useCheckoutFlow();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmOrder = useCallback(async (tokenId: number, idempotencyKey: string) => {
    setError(null);
    if (!isAuthenticated) {
      const message = "Sign in to complete the order";
      setError(message);
      return null;
    }
    if (!serverCartId) {
      const message = "Cart is syncing, please wait";
      setError(message);
      return null;
    }
    if (method === "PICKUP" && !selectedBranch) {
      const message = "Pickup branch is loading, please wait";
      setError(message);
      return null;
    }

    setLoading(true);
    try {
      const data: any = await checkoutService.confirm(
        {
          cartId: serverCartId,
          paymentTokenId: tokenId,
          fulfillmentType: method,
          branchId: method === "PICKUP" ? selectedBranch?.id : undefined,
          deliverySlotId: slotId ?? undefined,
        },
        idempotencyKey,
      );
      const orderId = data?.order_id ?? data?.orderId ?? data?.id ?? "order";
      const resolvedOrderId = String(orderId);
      const subtotalBefore = preview?.cart_total
        ? Number(preview.cart_total)
        : total;
      const deliveryFeeBefore =
        preview?.delivery_fee !== undefined && preview?.delivery_fee !== null
          ? Number(preview.delivery_fee)
          : 0;
      const slotLabel = deliverySlots.find((slot) => slot.id === slotId)?.label;
      const estimatedDelivery =
        method === "DELIVERY"
          ? slotLabel
            ? `Delivery window ${slotLabel}`
            : "Delivery window pending"
          : selectedBranch
            ? `Pickup ready at ${selectedBranch.name}`
            : "Pickup time pending";
      const orderSnapshot: OrderSuccessSnapshot = {
        orderId: resolvedOrderId,
        orderNumber: String(
          data?.order_number || data?.orderNumber || resolvedOrderId,
        ),
        fulfillmentType: method.toLowerCase() as OrderSuccessFulfillment,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          unit: item.unit,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: subtotalBefore,
        deliveryFee: deliveryFeeBefore,
        total: subtotalBefore + deliveryFeeBefore,
        estimatedDelivery,
        deliverySlot: slotLabel,
        pickupBranch: method === "PICKUP" ? selectedBranch?.name : undefined,
        deliveryAddress:
          method === "PICKUP" ? selectedBranch?.address : undefined,
      };
      return { orderId: resolvedOrderId, snapshot: orderSnapshot };
    } catch (err: any) {
      const message = err.message || "Checkout failed. Please try again.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    serverCartId,
    method,
    selectedBranch,
    slotId,
    preview,
    deliverySlots,
    items,
    total,
  ]);

  return {
    items,
    total,
    clearCart,
    isAuthenticated,
    method,
    setMethod,
    serverCartId,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
    selectedBranch,
    loading,
    error,
    setError,
    confirmOrder,
  };
};
