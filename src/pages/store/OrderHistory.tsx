import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ordersService } from "@/domains/orders/service";
import type { Order } from "@/domains/orders/types";
import { ORDER_STATUS_LABELS } from "@/domains/orders/types";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import Button from "@/components/ui/Button";
import { currencyILS } from "@/utils/format";
import { useApiError } from "@/hooks/useApiError";
import {
  formatDate,
  formatTime,
  formatSlotLabel,
} from "./order-history/formatters";
import { STATUS_STYLES } from "./order-history/styles";

const ORDER_HISTORY_LIMIT = 10;

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const _handleError = useApiError();

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.list({ limit: ORDER_HISTORY_LIMIT });
      setOrders(data);
    } catch (err) {
      console.error("Failed to load order history", err);
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load your orders at the moment.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const travelToStore = () => navigate("/store");

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Account
          </p>
          <h1 className="text-4xl font-black">Order History</h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Every confirmed order you placed is listed here. Tap any order to
            review its status and timing.
          </p>
        </div>
        <Button variant="outline" onClick={travelToStore}>
          Continue shopping
        </Button>
      </div>

      {loading ? (
        <LoadingState label="Fetching your order history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadOrders} />
      ) : orders.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-[3rem] p-12 text-center space-y-4">
          <p className="text-2xl font-bold">No orders yet</p>
          <p className="text-sm text-gray-500">
            Your completed orders will appear once you place them.
          </p>
          <Button variant="brand" onClick={travelToStore}>
            Start shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white border border-gray-100 rounded-[3rem] p-6 shadow-lg space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                    Order Number
                  </p>
                  <p className="text-2xl font-black">{order.orderNumber}</p>
                </div>
                <span
                  className={`text-xs font-bold px-4 py-1 rounded-full uppercase tracking-[0.3em] ${STATUS_STYLES[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-500 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-300">
                    Items
                  </p>
                  <p className="text-lg font-bold">
                    {(
                      Number(order.itemsCount) ||
                      order.items.length ||
                      0
                    ).toLocaleString()}{" "}
                    items
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-300">
                    Placed on
                  </p>
                  <p className="text-lg font-bold">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-300">
                    Total paid
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {currencyILS(Number(order.total) || 0)}
                  </p>
                </div>
              </div>

              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                {formatSlotLabel(order.deliverySlot)}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  to={`/store/order-success/${order.id}`}
                  className="text-sm font-bold text-[#008A45] hover:underline"
                >
                  View tracking
                </Link>
                <span className="text-xs text-gray-400">
                  Last updated: {formatTime(order.createdAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
