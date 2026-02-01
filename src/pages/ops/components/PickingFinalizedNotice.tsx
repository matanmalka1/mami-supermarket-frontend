import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { OrderStatus } from "@/domains/orders/types";

const STATUS_COPY: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: "Created",
  [OrderStatus.IN_PROGRESS]: "In Progress",
  [OrderStatus.READY]: "Ready",
  [OrderStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.DELAYED]: "Delayed",
  [OrderStatus.CANCELED]: "Canceled",
  [OrderStatus.MISSING]: "Missing",
};

interface Props {
  orderNumber?: string;
  status: OrderStatus;
  onBack: () => void;
}

const PickingFinalizedNotice: React.FC<Props> = ({
  orderNumber,
  status,
  onBack,
}) => (
  <div className="bg-white rounded-[3rem] border border-gray-100 p-10 space-y-6 shadow-2xl text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent pointer-events-none"></div>
    <div className="relative z-10 space-y-3">
      <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
        Picking Disconnected
      </p>
      <h3 className="text-3xl text-gray-900">
        {orderNumber || "Order status confirmed"}
      </h3>
      <Badge color="gray">{STATUS_COPY[status] || status}</Badge>
      <p className="text-sm text-gray-600">
        This order has already been finalized. Editing picks or re-running the
        workflow is locked to keep inventory consistent.
      </p>
      <Button variant="ghost" onClick={onBack}>
        Back to deck
      </Button>
    </div>
  </div>
);

export default PickingFinalizedNotice;
