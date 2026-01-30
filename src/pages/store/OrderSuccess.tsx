import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import OrderSummaryCard from "@/components/store/OrderSummaryCard";
import OrderProgressTimeline from "@/components/store/OrderProgressTimeline";
import { OrderSuccessSnapshot } from "@/domains/orders/types";
import { useAddresses } from "@/features/store/hooks/useAddresses";
import { loadOrderSnapshot } from "@/utils/order";

type OrderSuccessState = {
  snapshot?: OrderSuccessSnapshot;
};

const formatAddressLine = (address?: Record<string, any>) => {
  if (!address) return undefined;
  const parts = [
    address.address_line ?? address.addressLine,
    address.city,
    address.postal_code ?? address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
};

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [snapshot, setSnapshot] = useState<OrderSuccessSnapshot | null>(
    location.state?.snapshot ?? null,
  );
  const { addresses } = useAddresses();

  useEffect(() => {
    if (snapshot || !id) return;
    const stored = loadOrderSnapshot(id);
    if (stored) {
      setSnapshot(stored);
    }
  }, [id, snapshot]);

  const preferredAddress =
    snapshot?.deliveryAddress ||
    formatAddressLine(
      addresses.find((addr) => addr.is_default ?? addr.isDefault) ??
        addresses[0],
    ) ||
    undefined;

  const estimatedDelivery =
    snapshot?.estimatedDelivery || "Delivery window will be confirmed shortly.";
  const fulfillmentLabel =
    snapshot?.fulfillmentType === "pickup" ? "Pickup" : "Delivery";
  const addressLabel =
    preferredAddress ||
    "Delivery address will be confirmed once your courier is en route.";

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-12">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 animate-ping opacity-20" />
        <div className="relative w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
          <CheckCircle2 size={64} />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-6xl font-black  tracking-tighter">
          Ordered Successfully!
        </h1>
        <p className="text-xl text-gray-500 font-bold">
          Order ID:{" "}
          <span className="text-[#008A45]">
            {snapshot?.orderNumber || id || "––"}
          </span>
        </p>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Your items are now being routed to our optimized picking queue. We'll
          notify you when they are out for delivery.
        </p>
      </div>

      <OrderProgressTimeline />

      {snapshot ? (
        <OrderSummaryCard
          snapshot={snapshot}
          addressLabel={addressLabel}
          fulfillmentLabel={fulfillmentLabel}
          estimatedDelivery={estimatedDelivery}
        />
      ) : (
        <div className="bg-white border rounded-[3rem] p-12 shadow-xl">
          <p className="text-sm text-gray-500">
            We’re still preparing your summary. Check your order history if you
            need a breakdown.
          </p>
        </div>
      )}

      <div className="flex gap-4 max-w-md mx-auto">
        <Link to="/store" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-16 rounded-2xl font-black "
          >
            Keep Shopping
          </Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button className="w-full h-16 rounded-2xl font-black ">
            Track Order
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
