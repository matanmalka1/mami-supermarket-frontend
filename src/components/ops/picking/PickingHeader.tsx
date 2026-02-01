import { User, Clock, Printer } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import { Order } from "@/domains/orders/types";
import { formatOrderLabel } from "@/utils/orderLabel";

interface PickingHeaderProps {
  order: Order | null;
  itemsCount: number;
}

const PickingHeader: React.FC<PickingHeaderProps> = ({ order, itemsCount }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return <LoadingState label="Loading order details..." />;
  }

  const customerName = order.customer?.fullName ?? "";
  const deliveryLabel = order.deliverySlot?.startTime || "Immediate";

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex items-center justify-between shadow-sm relative overflow-hidden group print:hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#006666] opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
      <div className="relative z-10 flex gap-10 items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl text-gray-900 tracking-tighter">
              {formatOrderLabel(order)}
            </h1>
            <Badge color="emerald">{order.status}</Badge>
          </div>
          <div className="flex gap-6 text-sm text-gray-400 font-bold">
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <User size={14} /> {customerName}
            </span>
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <Clock size={14} /> {deliveryLabel}
            </span>
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <i className="fa-solid fa-box text-[10px]"></i> {itemsCount} units
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        className="h-14 px-8 rounded-2xl border-gray-200"
        onClick={handlePrint}
      >
        <Printer size={18} /> Print Packing List
      </Button>
    </div>
  );
};

export default PickingHeader;
