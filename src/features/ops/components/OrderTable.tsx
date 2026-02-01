import React from "react";
import { Link } from "react-router";
import { Table, THead, TBody, TR, TH, TD } from "../../../components/ui/Table";
import { Order } from "@/domains/orders/types";
import { formatOrderLabel } from "@/utils/orderLabel";
import OrderStatusSelect, {
  type OpsOrderStatus,
} from "@/features/ops/components/OrderStatusSelect";

interface OrderTableProps {
  orders: Order[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onStatusChange: (id: number, status: OpsOrderStatus) => void | Promise<void>;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  selectedIds,
  onToggleSelect,
  onStatusChange,
}) => {
  return (
  <Table>
    <THead>
      <TR isHoverable={false}>
        <TH className="w-12"></TH>
        <TH className="font-bold">Order ID</TH>
        <TH className="font-bold">Customer</TH>
        <TH className="font-bold">Priority</TH>
        <TH className="font-bold">Delivery Window</TH>
        <TH className="font-bold">Items Summary</TH>
        <TH className="font-bold">Status</TH>
        <TH className="text-right font-bold">Actions</TH>
      </TR>
    </THead>
    <TBody>
      {Array.isArray(orders) &&
        orders.map((order, index) => {
          const numericId =
            typeof order.id === "number" ? order.id : Number(order.id);
          const isSelected =
            !Number.isNaN(numericId) && selectedIds.includes(numericId);
          const toggleSelection = () => {
            if (Number.isNaN(numericId)) return;
            onToggleSelect(numericId);
          };
          return (
            <TR
              key={
                order.id ?? order.orderNumber ?? `${order.createdAt}-${index}`
              }
              className={`transition-colors ${isSelected ? "bg-emerald-50/50 border-l-4 border-l-emerald-500" : "hover:bg-gray-50/50"}`}
            >
              <TD>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={toggleSelection}
                  className="w-5 h-5 rounded-lg accent-emerald-600 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                />
              </TD>
              <TD>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-sm">
                  {formatOrderLabel(order)}
                </span>
              </TD>
              <TD>
                <div className="font-medium text-gray-900">
                  {order.customerName ||
                    order.customer?.fullName ||
                    "Anonymous"}
                </div>
              </TD>
              <TD>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.urgency === "critical"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : order.urgency === "dueSoon"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {order.urgency === "dueSoon" ? "Due Soon" : order.urgency || "On Track"}
                </span>
              </TD>
              <TD className="text-gray-700 font-medium text-sm">
                {order.deliverySlot?.startTime
                  ? `${order.deliverySlot.startTime} - ${order.deliverySlot.endTime}`
                  : "ASAP"}
              </TD>
              <TD>
                <div className="text-xs text-gray-600 leading-relaxed max-w-xs">
                  {order.itemsSummary || "Items not available"}
                </div>
              </TD>
              <TD>
                <OrderStatusSelect
                  status={order.status}
                  items={order.items}
                  onChange={(nextStatus) => {
                    if (Number.isNaN(numericId)) return;
                    onStatusChange(numericId, nextStatus);
                  }}
                />
              </TD>
              <TD className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/picking/${order.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg transition-all text-[10px] font-bold uppercase tracking-widest shadow-md"
                  >
                    Process
                  </Link>
                </div>
              </TD>
            </TR>
          );
        })}
    </TBody>
  </Table>
  );
};

export default OrderTable;

