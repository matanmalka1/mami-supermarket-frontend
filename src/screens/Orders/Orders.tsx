import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { sleep } from "@/utils/async";
import { useOrderHistory } from "./useOrderHistory";
import OrderHistoryView from "./components/OrderHistoryView";

const OrderHistory: React.FC = () => {
  const { orders, loading } = useOrderHistory();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleToggleOrder = (id: number) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  const handleDownloadInvoice = async (id: number) => {
    setDownloadingId(id);
    toast.loading(`Generating PDF invoice for #${id}...`, { id: "invoice" });

    await sleep(1500);

    toast.success("Invoice downloaded successfully", {
      id: "invoice",
      icon: "📄",
    });

    setDownloadingId(null);
  };

  return (
    <OrderHistoryView
      loading={loading}
      orders={orders}
      expandedOrderId={expandedOrder}
      downloadingId={downloadingId}
      onToggleOrder={handleToggleOrder}
      onDownloadInvoice={handleDownloadInvoice}
    />
  );
};

export default OrderHistory;
