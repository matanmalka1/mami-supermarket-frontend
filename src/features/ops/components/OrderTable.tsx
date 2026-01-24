import React from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from "react-router";
import StatusBadge from "../../../components/ui/StatusBadge";
import { Table, THead, TBody, TR, TH, TD } from "../../../components/ui/Table";
import { Order } from "../../../types/domain";

interface OrderTableProps {
  orders: Order[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  selectedIds,
  onToggleSelect,
}) => {
  return (
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
          orders.map((order, index) => (
            <TR
              key={order.id ?? order.orderNumber ?? `${order.createdAt}-${index}`}
            className={selectedIds.includes(order.id) ? "bg-emerald-50/30" : ""}
          >
            <TD>
              <input
                type="checkbox"
                checked={selectedIds.includes(order.id)}
                onChange={() => onToggleSelect(order.id)}
                className="w-5 h-5 rounded-md accent-emerald-600 border-gray-200 cursor-pointer"
              />
            </TD>
            <TD className="font-black italic text-[#006666]">
              #{order.orderNumber || order.id.slice(0, 8)}
            </TD>
            <TD>
              <div className="text-gray-900">
                {order.customer?.fullName || "Anonymous"}
              </div>
              <div className="text-[10px] uppercase text-gray-400 tracking-widest">
                {order.urgency}
              </div>
            </TD>
            <TD className="text-gray-600 font-medium italic">
              {order.deliverySlot?.startTime
                ? `${order.deliverySlot.startTime} - ${order.deliverySlot.endTime}`
                : "ASAP"}
            </TD>
            <TD className="text-center">
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs">
                {order.itemsCount}
              </span>
            </TD>
            <TD>
              <StatusBadge status={order.status} />
            </TD>
            <TD className="text-right">
              <Link
                to={`/picking/${order.id}`}
                className="inline-flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-xl hover:bg-[#006666] hover:text-white hover:border-[#006666] transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
              >
                Process
              </Link>
            </TD>
          </TR>
          ))}
      </TBody>
    </Table>
  );
};

export default OrderTable;
