import React from "react";
import { Link } from "react-router";
import EmptyState from "@/components/shared/EmptyState";
import LoadingState from "@/components/shared/LoadingState";
import ProductCard from "@/screens/Storefront/components/ProductCard";
import { useWishlist } from "@/screens/Wishlist/useWishlist";
import { useWishlistProducts } from "@/screens/Wishlist/useWishlistProducts";

import type { WishlistItem } from "@/screens/Wishlist/useWishlist";

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
              className="text-xs font-black uppercase tracking-widest text-[#008A45]"
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
              className="text-xs font-black uppercase tracking-widest text-[#008A45]"
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
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">
            Favorites
          </p>
          <h1 className="text-3xl font-black tracking-tighter">My Wishlist</h1>
        </div>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-200 text-sm font-black uppercase tracking-[0.3em] text-gray-600 hover:border-[#008A45] hover:text-[#008A45] transition-all"
        >
          Continue shopping
        </Link>
      </div>
      {/* ...rest of the component... */}
    </div>
  );
};

export default WishlistPage;
