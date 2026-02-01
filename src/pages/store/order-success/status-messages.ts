import { OrderStatus } from "@/domains/orders/types";

/**
 * Get status-specific message for order
 */
export const getStatusMessage = (orderStatus: OrderStatus): string => {
  switch (orderStatus) {
    case OrderStatus.CREATED:
      return "Your items are now being routed to our optimized picking queue. We'll notify you when they are out for delivery.";
    case OrderStatus.IN_PROGRESS:
      return "Your order is being picked by our team. We'll notify you when it's ready for delivery.";
    case OrderStatus.READY:
      return "Your order is packed and ready! It will be out for delivery soon.";
    case OrderStatus.OUT_FOR_DELIVERY:
      return "Your order is on its way! Track your delivery in real-time.";
    case OrderStatus.DELIVERED:
      return "Your order has been delivered. Thank you for shopping with us!";
    case OrderStatus.CANCELED:
      return "This order has been canceled. If you have questions, please contact support.";
    case OrderStatus.DELAYED:
      return "Your order is experiencing a delay. We're working to get it to you as soon as possible.";
    case OrderStatus.MISSING:
      return "There's an issue with your order. Our team is investigating. We'll contact you shortly.";
    default:
      return "Your order is being processed.";
  }
};
