import { Link } from "react-router";
import EmptyState from "@/components/ui/EmptyState";

const WishlistEmptyState = () => (
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

export default WishlistEmptyState;
