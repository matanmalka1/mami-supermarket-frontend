import React from "react";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { OrderHistoryEntry } from "@/types/order-history";
import OrderHistoryItem from "./OrderHistoryItem";

export type OrderHistoryViewProps = {
  loading: boolean;
  orders: OrderHistoryEntry[];
  expandedOrderId: number | null;
  downloadingId: number | null;
  onToggleOrder: (id: number) => void;
  onDownloadInvoice: (id: number) => void;
};

const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  loading,
  orders,
  expandedOrderId,
  downloadingId,
  onToggleOrder,
  onDownloadInvoice,
}) => {
  if (loading) {
    return (
      <div className="py-40">
        <LoadingState label="Loading order history..." />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-5xl font-black italic text-gray-900 tracking-tighter">
          My Orders
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
          Live tracking and historical data
        </p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <EmptyState
            title="No orders found in your history"
            description="Complete your first checkout to see it here."
          />
        ) : (
          orders.map((order) => (
            <OrderHistoryItem
              key={order.id}
              order={order}
              isExpanded={expandedOrderId === order.id}
              downloadingId={downloadingId}
              onToggle={() => onToggleOrder(order.id)}
              onDownloadInvoice={onDownloadInvoice}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryView;
