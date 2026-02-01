import { OrderSuccessSnapshot } from "@/domains/orders/types";

const STORAGE_PREFIX = "mami_order_success";

const storageKey = (orderId: string) => `${STORAGE_PREFIX}:${orderId}`;

const getStorage = () => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
};

export const saveOrderSnapshot = (
  orderId: string,
  snapshot: OrderSuccessSnapshot,
) => {
  const storage = getStorage();
  if (!storage || !orderId) return;
  try {
    storage.setItem(storageKey(orderId), JSON.stringify(snapshot));
  } catch {
    // Ignore storage errors (quota, serialization, etc.)
  }
};

export const loadOrderSnapshot = (
  orderId: string | undefined,
): OrderSuccessSnapshot | null => {
  if (!orderId) return null;
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(storageKey(orderId));
    if (!raw) return null;
    return JSON.parse(raw) as OrderSuccessSnapshot;
  } catch {
    return null;
  }
};
