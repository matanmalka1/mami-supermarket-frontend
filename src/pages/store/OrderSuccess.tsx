import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import OrderSummaryCard from "@/components/store/OrderSummaryCard";
import OrderProgressTimeline from "@/components/store/OrderProgressTimeline";
import { OrderSuccessSnapshot, OrderStatus } from "@/domains/orders/types";
import { useAddresses } from "@/features/store/hooks/useAddresses";
import { loadOrderSnapshot } from "@/utils/order";
import { ordersService } from "@/domains/orders/service";
import { useCart } from "@/context/cart-context";

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
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    OrderStatus.CREATED,
  );
  const { addresses } = useAddresses();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (snapshot || !id) return;
    const stored = loadOrderSnapshot(id);
    if (stored) {
      setSnapshot(stored);
    }
  }, [id, snapshot]);

  useEffect(() => {
    if (!id) return;

    const fetchOrderStatus = async () => {
      try {
        const order = await ordersService.get(id);
        setOrderStatus(order.status);
      } catch (error) {
        console.error("Failed to fetch order status:", error);
      }
    };
    fetchOrderStatus();

    const interval = setInterval(fetchOrderStatus, 30000);

    return () => clearInterval(interval);
  }, [id]);

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
    "Delivery address will be confirmed once your courier is on route.";

  const getStatusMessage = () => {
    switch (orderStatus) {
      case OrderStatus.CREATED:
        return "Your items are now being routed to our optimized picking queue. We'll notify you when they are out for delivery.";
      case OrderStatus.IN_PROGRESS:
        return "Your order is being picked by our team. We'll notify you when it's ready for delivery.";
      case OrderStatus.READY:
        return "Your order is packed and ready! It will be out for delivery soon.";
      case OrderStatus.OUT_FOR_DELIVERY:
        return "Your order is on its way! Track your delivery in real-time.";
      case OrderStatus.DELIVERED:
        return "Your order has been delivered. Thank you for shopping with us!";
      case OrderStatus.CANCELED:
        return "This order has been canceled. If you have questions, please contact support.";
      case OrderStatus.DELAYED:
        return "Your order is experiencing a delay. We're working to get it to you as soon as possible.";
      case OrderStatus.MISSING:
        return "There's an issue with your order. Our team is investigating. We'll contact you shortly.";
      default:
        return "Your order is being processed.";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-12">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 animate-ping opacity-20" />
        <div className="relative w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
          <CheckCircle2 size={64} />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-6xl  tracking-tighter">Ordered Successfully!</h1>
        <p className="text-xl text-gray-500 font-bold">
          Order ID:{" "}
          <span className="text-[#008A45]">
            {snapshot?.orderNumber || id || "––"}
          </span>
        </p>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Your items are now being routed to our optimized picking queue. We'll{" "}
          {getStatusMessage()}
        </p>
      </div>

      <OrderProgressTimeline currentStatus={orderStatus} />

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
            We’re still preparing your summary
          </p>
        </div>
      )}

      <div className="flex gap-4 max-w-md mx-auto">
        <Link to="/store" className="flex-1">
          <Button variant="outline" className="w-full h-16 rounded-2xl ">
            Keep Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
