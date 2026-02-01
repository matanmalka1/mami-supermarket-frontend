import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CheckoutStepper, {
  CheckoutStep,
} from "@/features/checkout/components/CheckoutStepper";
import FulfillmentStep from "@/features/checkout/components/FulfillmentStep";
import ScheduleStep from "@/features/checkout/components/ScheduleStep";
import PaymentStep from "@/features/checkout/components/PaymentStep";
import Button from "@/components/ui/Button";
import { useCheckoutProcess } from "@/features/store/hooks/useCheckoutProcess";
import { checkoutService } from "@/domains/checkout/service";
import { saveOrderSnapshot } from "@/utils/order";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("FULFILLMENT");
  const {
    items,
    total,
    clearCart,
    isAuthenticated,
    method,
    setMethod,
    selectedBranch,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
    loading,
    error,
    setError,
    confirmOrder,
  } = useCheckoutProcess();

  const idempotencyKey = useMemo(
    () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  // Store the payment token id from PaymentStep
  // Called by PaymentStep after payment token is created
  const handleConfirm = async (tokenId: number) => {
    setError(null);
    const payload = await confirmOrder(tokenId, idempotencyKey);
    if (!payload) return;
    saveOrderSnapshot(payload.orderId, payload.snapshot);
    clearCart();
    navigate(`/store/order-success/${payload.orderId}`, {
      state: { snapshot: payload.snapshot },
    });
  };

  // Avoid calling navigate during render: useEffect for redirect
  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate("/store");
    }
  }, [items.length, loading, navigate]);

  if (items.length === 0 && !loading) {
    return null;
  }

  // Inline error state UI for checkout errors
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4">
          <p className="text-2xl text-red-700 uppercase tracking-[0.2em]">
            Checkout Error
          </p>
          <p className="text-red-600 font-bold">{error}</p>
          <Button
            variant="emerald"
            onClick={() => {
              setError(null);
            }}
          >
            Retry
          </Button>
        </div>
        <Button variant="outline" onClick={() => navigate("/store")}>
          Back to Store
        </Button>
      </div>
    );
  }

  const subtotal = preview?.cart_total ? Number(preview.cart_total) : total;
  const DELIVERY_THRESHOLD = 150;
  const DELIVERY_FEE_UNDER_THRESHOLD = 30;
  const fallbackDeliveryFee =
    method === "DELIVERY" && subtotal < DELIVERY_THRESHOLD
      ? DELIVERY_FEE_UNDER_THRESHOLD
      : 0;
  const deliveryFee =
    preview?.delivery_fee !== undefined && preview?.delivery_fee !== null
      ? Number(preview.delivery_fee)
      : fallbackDeliveryFee;
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
      {method === "PICKUP" && !selectedBranch && (
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
          Loading pickup branch information...
        </div>
      )}

      <div className="bg-white border rounded-[3rem] p-12 shadow-xl space-y-10 min-h-[500px]">
        {step === "FULFILLMENT" && (
          <FulfillmentStep
            method={method}
            onSelect={setMethod}
            onNext={setStep}
          />
        )}

        {step === "SCHEDULE" && (
          <ScheduleStep
            slots={deliverySlots}
            selected={slotId}
            onSelect={(id) => setSlotId(id)}
            onBack={() => setStep("FULFILLMENT")}
            onNext={setStep}
          />
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
            onCreatePaymentToken={checkoutService.createPaymentToken}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
