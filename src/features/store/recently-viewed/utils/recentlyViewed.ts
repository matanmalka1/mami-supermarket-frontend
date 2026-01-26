export const RECENTLY_VIEWED_KEY = "mami_recent_items";
const MAX_RECENT = 8;

export type RecentlyViewedProduct = {
  id: number;
  name: string;
  category?: string;
  price: number;
  tag?: string;
  image?: string;
  oldPrice?: number;
  unit?: string;
};

const readStored = (): RecentlyViewedProduct[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item?.id === "number");
  } catch {
    return [];
  }
};

export const addRecentlyViewedItem = (product: RecentlyViewedProduct) => {
  if (typeof window === "undefined") return;
  const existing = readStored().filter((item) => item.id !== product.id);
  const updated = [product, ...existing].slice(0, MAX_RECENT);
  window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
};

export const loadRecentlyViewedItems = () => readStored();
