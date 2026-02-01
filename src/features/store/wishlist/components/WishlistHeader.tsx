import { Link } from "react-router";

const WishlistHeader = () => (
  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
        Favorites
      </p>
      <h1 className="text-3xl tracking-tighter">My Wishlist</h1>
    </div>
    <Link
      to="/store"
      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-200 text-sm uppercase tracking-[0.3em] text-gray-600 hover:border-[#008A45] hover:text-[#008A45] transition-all"
    >
      Continue shopping
    </Link>
  </div>
);

export default WishlistHeader;
