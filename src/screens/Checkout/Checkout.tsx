import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiService } from "@/services/api";
import { useCart } from "./CartContext";
import CheckoutStepper, { CheckoutStep } from "./components/CheckoutStepper";
import FulfillmentStep from "./components/FulfillmentStep";
import ScheduleStep from "./components/ScheduleStep";
import PaymentStep from "./components/PaymentStep";
import Button from "@/components/ui/Button";
import { useCheckoutFlow } from "@/hooks/useCheckoutFlow";
import { OrderSuccessSnapshot } from "./order-success";
import { saveOrderSnapshot } from "./order";

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("FULFILLMENT");
  const [loading, setLoading] = useState(false);
  const {
    isAuthenticated,
    method,
    setMethod,
    serverCartId,
    selectedBranch,
    deliverySlots,
    slotId,
    setSlotId,
    preview,
  } = useCheckoutFlow();

  const idempotencyKey = useMemo(
    () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  // Store the payment token id from PaymentStep
  const [paymentTokenId, setPaymentTokenId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Called by PaymentStep after payment token is created
  const handleConfirm = async (tokenId: number) => {
    setPaymentTokenId(tokenId);
    setError(null);
    if (!isAuthenticated) {
      setError("Sign in to complete the order");
      return;
    }
    if (!serverCartId) {
      setError("Cart is syncing, please wait");
      return;
    }
    if (method === "PICKUP" && !selectedBranch) {
      setError("Pickup branch is loading, please wait");
      return;
    }
    setLoading(true);
    try {
      const data: any = await apiService.checkout.confirm(
        {
          cart_id: serverCartId,
          payment_token_id: tokenId,
          fulfillment_type: method,
          branch_id: method === "PICKUP" ? selectedBranch?.id : undefined,
          delivery_slot_id: slotId ?? undefined,
        },
        idempotencyKey,
      );
      const orderId = data?.order_id || data?.orderId || data?.id || "order";
      const resolvedOrderId = String(orderId);
      const subtotalBefore = preview?.cart_total
        ? Number(preview.cart_total)
        : total;
      const deliveryFeeBefore =
        preview?.delivery_fee !== undefined && preview?.delivery_fee !== null
          ? Number(preview.delivery_fee)
          : 0;
      const slotLabel = deliverySlots.find(
        (slot: { id: number; label: string }) => slot.id === slotId,
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
        fulfillmentType: method,
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
      saveOrderSnapshot(resolvedOrderId, orderSnapshot);
      clearCart();
      navigate(`/store/order-success/${resolvedOrderId}`, {
        state: { snapshot: orderSnapshot },
      });
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <p className="text-2xl font-black text-red-700 uppercase tracking-[0.2em]">
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
            onCreatePaymentToken={apiService.checkout.createPaymentToken}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
