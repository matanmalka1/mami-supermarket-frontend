import { useCallback, useState, useEffect } from "react";
import { useCheckoutFlow } from "@/features/store/hooks/useCheckoutFlow";
import { checkoutService } from "@/domains/checkout/service";
import { cartService } from "@/domains/cart/service";
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
    cartIdLoading,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
    selectedBranch,
  } = useCheckoutFlow();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for cart ID to be loaded first
    if (cartIdLoading) return;

    if (!isAuthenticated || !serverCartId) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }

    const loadCartItems = async () => {
      setCartLoading(true);
      try {
        const cart = await cartService.get();
        setCartItems(cart.items || []);
      } catch (error) {
        console.error("[useCheckoutProcess] Failed to load cart items:", error);
        setCartItems([]);
      } finally {
        setCartLoading(false);
      }
    };

    loadCartItems();
  }, [isAuthenticated, serverCartId, cartIdLoading]);

  const confirmOrder = useCallback(
    async (tokenId: number, idempotencyKey: string) => {
      setError(null);
      if (!isAuthenticated) {
        setError("Sign in to complete the order");
        return null;
      }
      if (!serverCartId) {
        setError("Cart is syncing, please wait");
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

        const totalPaid = data?.totalPaid || data?.total_paid || 0;
        const cartTotal = preview?.cartTotal || preview?.cart_total || 0;
        const deliveryFee = preview?.deliveryFee ?? preview?.delivery_fee ?? 0;

        const slotLabel = deliverySlots.find(
          (slot) => slot.id === slotId,
        )?.label;
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
          items: cartItems.map((item) => ({
            id: item.productId || item.id,
            name: item.name || `Product ${item.productId || item.id}`,
            image: item.image || "",
            unit: item.unit,
            price: item.unitPrice || item.price || 0,
            quantity: item.quantity,
          })),
          subtotal: Number(cartTotal),
          deliveryFee: Number(deliveryFee),
          total: Number(totalPaid),
          estimatedDelivery,
          deliverySlot: slotLabel,
          pickupBranch: method === "PICKUP" ? selectedBranch?.name : undefined,
          deliveryAddress:
            method === "PICKUP" ? selectedBranch?.address : undefined,
        };
        return { orderId: resolvedOrderId, snapshot: orderSnapshot };
      } catch (err: any) {
        setError(err.message || "Checkout failed. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [
      isAuthenticated,
      serverCartId,
      method,
      selectedBranch,
      slotId,
      preview,
      deliverySlots,
      cartItems,
    ],
  );

  return {
    cartItems,
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
    cartLoading,
    error,
    setError,
    confirmOrder,
  };
};
