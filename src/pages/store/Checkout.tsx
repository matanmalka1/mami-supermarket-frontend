import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { apiService } from "../services/api";
import { useCart } from "../context/CartContext";
import CheckoutStepper, { CheckoutStep } from "../components/checkout/CheckoutStepper";
import FulfillmentStep from "../components/checkout/FulfillmentStep";
import ScheduleStep from "../components/checkout/ScheduleStep";
import PaymentStep from "../components/checkout/PaymentStep";

const SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];

const Checkout: React.FC = () => {
  const { items, total, clearCart, refresh } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("FULFILLMENT");
  const [method, setMethod] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [slot, setSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const cartId = useMemo(() => {
    const first = (items as any)?.[0] || {};
    return first.cart_id || first.cartId || first.id;
  }, [items]);

  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    const loadPreview = async () => {
      if (!cartId) return;
      try {
        const data = await apiService.checkout.preview({
          cart_id: cartId,
          fulfillment_type: method,
          delivery_slot_id: slot || undefined,
        });
        setPreview(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load checkout preview");
      }
    };
    loadPreview();
  }, [cartId, method, slot]);

  const handleConfirm = async () => {
    if (!cartId) {
      toast.error("Missing cart");
      return;
    }
    setLoading(true);
    try {
      const data: any = await apiService.checkout.confirm(
        {
          cart_id: cartId,
          payment_token_id: crypto.randomUUID(),
          fulfillment_type: method,
          delivery_slot_id: slot || undefined,
        },
        idempotencyKey,
      );
      clearCart();
      refresh?.();
      const orderId = data?.order_id || data?.orderId || data?.id || "order";
      navigate(`/store/order-success/${orderId}`);
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    navigate("/store");
    return null;
  }

  const subtotal = preview?.cart_total ? Number(preview.cart_total) : total;
  const deliveryFee =
    preview?.delivery_fee !== undefined && preview?.delivery_fee !== null
      ? Number(preview.delivery_fee)
      : 0;
  const finalTotal = subtotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
      <CheckoutStepper step={step} />

      <div className="bg-white border rounded-[3rem] p-12 shadow-xl space-y-10 min-h-[500px]">
        {step === "FULFILLMENT" && (
          <FulfillmentStep method={method} onSelect={setMethod} onNext={setStep} />
        )}

        {step === "SCHEDULE" && (
          <ScheduleStep slots={SLOTS} selected={slot} onSelect={setSlot} onBack={() => setStep("FULFILLMENT")} onNext={setStep} />
        )}

        {step === "PAYMENT" && (
          <PaymentStep
            itemsCount={items.length}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={finalTotal}
            loading={loading}
            onBack={() => setStep("SCHEDULE")}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
