import { Link } from "react-router";
import EmptyState from "@/components/shared/EmptyState";

const WishlistUnavailableState = () => (
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

export default WishlistUnavailableState;
