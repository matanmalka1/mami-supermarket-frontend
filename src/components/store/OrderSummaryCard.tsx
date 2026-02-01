import React from "react";
import Card from "@/components/ui/Card";
import { OrderSuccessSnapshot } from "@/domains/orders/types";
import { currencyILS } from "@/utils/format";

type Props = {
  snapshot: OrderSuccessSnapshot;
  addressLabel: string;
  fulfillmentLabel: string;
  estimatedDelivery: string;
};

const OrderSummaryCard: React.FC<Props> = ({
  snapshot,
  addressLabel,
  fulfillmentLabel,
  estimatedDelivery,
}) => (
  <Card variant="glass" padding="lg" className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
          Estimated {fulfillmentLabel}
        </p>
        <p className="text-xl text-gray-900">{estimatedDelivery}</p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
          Delivery Address
        </p>
        <p className="text-sm text-gray-700">{addressLabel}</p>
      </div>
    </div>

    <div className="space-y-4">
      {snapshot.items.map((item) => (
        <div
          key={`${item.id}-${item.name}`}
          className="flex gap-4 items-center border border-gray-100 rounded-2xl p-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-300">{item.name?.[0]}</span>
            )}
          </div>
          <div className="flex-1 text-left">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-900">{item.name}</p>
              <span className="text-[10px] uppercase text-gray-400 tracking-[0.3em]">
                {item.unit ?? "unit"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Qty {item.quantity} • {currencyILS(item.price)} each
            </p>
          </div>
          <p className="text-lg">{currencyILS(item.price * item.quantity)}</p>
        </div>
      ))}
    </div>

    <div className="border-t pt-6 space-y-3 text-left">
      <div className="flex justify-between text-sm font-bold text-gray-600">
        <span>Subtotal</span>
        <span>{currencyILS(snapshot.subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm font-bold text-emerald-600">
        <span>Delivery</span>
        <span>
          {snapshot.deliveryFee === 0
            ? "FREE"
            : currencyILS(snapshot.deliveryFee)}
        </span>
      </div>
      <div className="flex justify-between text-2xl uppercase tracking-[0.2em]">
        <span>Total Paid</span>
        <span>{currencyILS(snapshot.total)}</span>
      </div>
    </div>
  </Card>
);

export default OrderSummaryCard;
