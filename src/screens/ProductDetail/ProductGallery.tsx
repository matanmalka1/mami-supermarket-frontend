import { useState } from "react";
import { Heart, Maximize2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductGalleryProps {
  images?: string[];
  name?: string;
  productId?: number;
}

const initials = (text?: string) => {
  if (!text) return "?";
  return (
    text
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  );
};

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  name,
  productId,
}) => {
  const displayImages = images?.filter(Boolean) ?? [];
  const hasImages = displayImages.length > 0;
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const isLiked = typeof productId === "number" && isWishlisted(productId);

  const handleWishlistToggle = () => {
    if (typeof productId !== "number") {
      toast("Wishlist is not available for this product", {
        icon: "⚠️",
        style: { borderRadius: "1rem", fontWeight: "bold" },
      });
      return;
    }
    toggleWishlist(productId);
    toast(isLiked ? "Removed from wishlist" : "Added to wishlist", {
      icon: isLiked ? "🟣" : "🩷",
      style: { borderRadius: "1rem", fontWeight: "bold" },
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-6">
      <div
        className="relative aspect-[4/5] bg-[#F9F9F9] rounded-[2.5rem] overflow-hidden group border border-gray-100 cursor-zoom-in shadow-inner"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        {hasImages ? (
          <img
            src={displayImages[activeIdx]}
            className="w-full h-full object-contain p-12 transition-transform duration-200 ease-out pointer-events-none"
            alt="Product Detail"
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: isZooming ? "scale(2.5)" : "scale(1)",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-gray-300">
            {initials(name)}
          </div>
        )}
        {/* Overlay Controls ...existing code... */}
      </div>
      {/* ...existing code... */}
    </div>
  );
};

export default ProductGallery;
