import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/api";
import { useCart } from "@/context/CartContext";
import CheckoutStepper, { CheckoutStep } from "@/components/checkout/CheckoutStepper";
import FulfillmentStep from "@/components/checkout/FulfillmentStep";
import ScheduleStep from "@/components/checkout/ScheduleStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("FULFILLMENT");
  const [method, setMethod] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [slot, setSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const [serverCartId, setServerCartId] = useState<string | null>(null);

  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

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
    if (!serverCartId) {
      setPreview(null);
      return;
    }

    const loadPreview = async () => {
      try {
        const data = await apiService.checkout.preview({
          cart_id: serverCartId,
          fulfillment_type: method,
          delivery_slot_id: slot || undefined,
        });
        setPreview(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load checkout preview");
      }
    };

    loadPreview();
  }, [serverCartId, method, slot]);

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to complete the order");
      return;
    }
    if (!serverCartId) {
      toast.error("Cart is syncing, please wait");
      return;
    }
    setLoading(true);
    try {
      const data: any = await apiService.checkout.confirm(
        {
          cart_id: serverCartId,
          payment_token_id: crypto.randomUUID(),
          fulfillment_type: method,
          delivery_slot_id: slot || undefined,
        },
        idempotencyKey,
      );
      clearCart();
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
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-center space-y-2 font-bold text-amber-800 uppercase tracking-[0.3em]">
          <p>Sign in to unlock checkout preview and payment.</p>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      )}

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
