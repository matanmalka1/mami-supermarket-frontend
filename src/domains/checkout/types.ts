// Checkout domain types (frontend only, no DTOs, no backend naming)
// Arrow functions only. No imports from other domains unless approved.

export type CheckoutCartItem = {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  unit?: string;
};

export type CheckoutAddress = {
  id: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export type CheckoutPaymentMethod = {
  id: number;
  type: string;
  last4: string;
  expiry: string;
  cardholder: string;
};

export type CheckoutOrderSummary = {
  subtotal: number;
  deliveryFee: number;
  total: number;
  discount?: number;
};
