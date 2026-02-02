import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Card from "@/components/ui/Card";
import CheckoutStepper, {
  CheckoutStep,
} from "@/features/checkout/components/CheckoutStepper";
import FulfillmentStep from "@/features/checkout/components/FulfillmentStep";
import ScheduleStep from "@/features/checkout/components/ScheduleStep";
import PaymentStep from "@/features/checkout/components/PaymentStep";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import { useCheckoutProcess } from "@/features/store/hooks/useCheckoutProcess";
import { checkoutService } from "@/domains/checkout/service";
import { saveOrderSnapshot } from "@/utils/order";
import { calculateDeliveryFee } from "./checkout/pricing";
import { useGlobalSettings } from "@/features/admin/hooks/useGlobalSettings";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("FULFILLMENT");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const { settings } = useGlobalSettings();
  const {
    cartItems,
    isAuthenticated,
    method,
    setMethod,
    selectedBranch,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
    loading,
    cartLoading,
    error,
    setError,
    confirmOrder,
  } = useCheckoutProcess();

  const items = useMemo(() => cartItems ?? [], [cartItems]);
  const total = preview?.cart_total ? Number(preview.cart_total) : 0;

  const idempotencyKey = useMemo(
    () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  const handleConfirm = async (tokenId: number) => {
    setError(null);
    const payload = await confirmOrder(tokenId, idempotencyKey);
    if (!payload) return;
    saveOrderSnapshot(payload.orderId, payload.snapshot);
    setOrderCompleted(true);
    navigate(`/store/order-success/${payload.orderId}`, {
      state: { snapshot: payload.snapshot },
      replace: true,
    });
  };

  useEffect(() => {
    // Only redirect if cart is loaded, empty, and user is authenticated
    if (
      !cartLoading &&
      items.length === 0 &&
      !orderCompleted &&
      isAuthenticated
    ) {
      navigate("/store");
    }
  }, [
    cartLoading,
    items.length,
    navigate,
    orderCompleted,
    isAuthenticated,
    items,
  ]);

  // Show loading while cart is being fetched
  if (cartLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <LoadingState label="Loading cart..." />
      </div>
    );
  }

  if (items.length === 0 && !orderCompleted) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center space-y-6">
        <ErrorState
          message={
            <div className="space-y-2 text-center">
              <p className="text-xl uppercase tracking-[0.2em]">
                Checkout Error
              </p>
              <span>{error}</span>
            </div>
          }
          onRetry={() => setError(null)}
        />
        <Button variant="outline" onClick={() => navigate("/store")}>
          Back to Store
        </Button>
      </div>
    );
  }

  const subtotal = preview?.cart_total ? Number(preview.cart_total) : total;
  const deliveryFee = calculateDeliveryFee(
    method,
    subtotal,
    preview?.delivery_fee,
    settings.deliveryMin,
    settings.deliveryFee,
  );
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
        <LoadingState label="Loading pickup branch information..." />
      )}

      <Card variant="glass" padding="xl" className="space-y-10 min-h-[500px]">
        {step === "FULFILLMENT" && (
          <FulfillmentStep
            method={method}
            onSelect={setMethod}
            onNext={setStep}
            error={
              !selectedBranch && method === "PICKUP"
                ? "Select a pickup branch"
                : null
            }
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
      </Card>
    </div>
  );
};

export default Checkout;
