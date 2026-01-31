import React from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
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
}) => (
  <Table>
    <THead>
      <TR isHoverable={false}>
        <TH className="w-16"></TH>
        <TH>Order ID</TH>
        <TH>Customer / Priority</TH>
        <TH>Fulfillment Window</TH>
        <TH className="text-center">Items</TH>
        <TH>Status</TH>
        <TH className="text-right">Actions</TH>
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
              key={order.id ?? order.orderNumber ?? `${order.createdAt}-${index}`}
              className={isSelected ? "bg-emerald-50/30" : ""}
            >
              <TD>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={toggleSelection}
                  className="w-5 h-5 rounded-md accent-emerald-600 border-gray-200 cursor-pointer"
                />
              </TD>
              <TD className=" text-[#006666]">{formatOrderLabel(order)}</TD>
              <TD>
                <div className="text-gray-900">
                  {order.customerName || order.customer?.fullName || "Anonymous"}
                </div>
                <div className="text-[10px] uppercase text-gray-400 tracking-widest">
                  {order.urgency}
                </div>
              </TD>
              <TD className="text-gray-600 font-medium ">
                {order.deliverySlot?.startTime
                  ? `${order.deliverySlot.startTime} - ${order.deliverySlot.endTime}`
                  : "ASAP"}
              </TD>
              <TD className="text-left">
                <div className="text-xs text-gray-500  leading-tight">
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
                <Link
                  to={`/picking/${order.id}`}
                  className="inline-flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-[#006666] hover:text-white hover:border-[#006666] transition-all text-[10px] uppercase tracking-widest shadow-sm"
                >
                  Process
                </Link>
              </TD>
            </TR>
          );
        })}
    </TBody>
  </Table>
);

export default OrderTable;
