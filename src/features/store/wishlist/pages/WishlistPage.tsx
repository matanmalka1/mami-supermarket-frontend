import { Link } from "react-router";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import WishlistHeader from "../components/WishlistHeader";
import WishlistProductCard from "../components/WishlistProductCard";
import { useWishlist } from "@/context/wishlist-context";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { catalogService } from "@/domains/catalog/service";
import { Product } from "@/domains/catalog/types";
import type { WishlistItem } from "@/domains/wishlist/types";

const useWishlistProducts = () => {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ids = Array.from(new Set(items.map((item: WishlistItem) => item.id)));
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    Promise.allSettled(ids.map((id) => catalogService.getProduct(id)))
      .then((results) => {
        if (!active) return;
        const fulfilled = results
          .filter(
            (result): result is PromiseFulfilledResult<Product> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value);
        setProducts(fulfilled);
        if (results.some((result) => result.status === "rejected")) {
          toast.error("Some wishlist items could not be loaded");
        }
      })
      .catch(() => {
        if (active) toast.error("Failed to load wishlist items");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [items]);

  return {
    products,
    loading,
  };
};

const WishlistPage: React.FC = () => {
  const { items, updateWishlistItem } = useWishlist();
  const { products, loading } = useWishlistProducts();
  const hasItems = items.length > 0;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20">
        <LoadingState label="Loading your wishlist..." />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="max-w-3xl mx-auto py-20">
        <EmptyState
          title="Your wishlist is empty"
          description="Tap the heart on any product to keep it here for later."
          action={
            <Link
              to="/store"
              className="text-xs uppercase tracking-widest text-[#008A45]"
            >
              Continue shopping
            </Link>
          }
        />
      </div>
    );
  }

  if (hasItems && products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20">
        <EmptyState
          title="Wishlist items unavailable"
          description="One or more saved products cannot be found right now."
          action={
            <Link
              to="/store"
              className="text-xs uppercase tracking-widest text-[#008A45]"
            >
              Browse the store
            </Link>
          }
        />
      </div>
    );
  }

  // Helper to get WishlistItem by product id
  const getWishlistItem = (productId: number): WishlistItem | undefined =>
    items.find((item: WishlistItem) => item.id === productId);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <WishlistHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <WishlistProductCard
            key={product.id}
            product={product}
            wishlistItem={getWishlistItem(product.id)}
            updateWishlistItem={updateWishlistItem}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
