import React from "react";
import { currencyILS } from "@/utils/format";

interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemsCount,
  subtotal,
  deliveryFee,
  total,
}) => (
  <div className="p-8 bg-gray-50 rounded-3xl space-y-6 border border-gray-100">
    <div className="flex justify-between items-center font-bold text-gray-500 uppercase text-xs tracking-widest border-b pb-6">
      <span>Order Summary</span>
      <span>{itemsCount} Items</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between font-bold text-gray-900">
        <span>Subtotal</span>
        <span>{currencyILS(subtotal)}</span>
      </div>
      <div className="flex justify-between font-bold text-emerald-600">
        <span>Delivery</span>
        <span>{deliveryFee === 0 ? "FREE" : currencyILS(deliveryFee)}</span>
      </div>
      <div className="flex justify-between text-2xl  pt-4 border-t">
        <span>Total</span>
        <span>{currencyILS(total)}</span>
      </div>
    </div>
  </div>
);

export default OrderSummary;
