import { useRef, useState } from "react";
import ProductGalleryMainImage from "./ProductGalleryMainImage";
import GalleryThumbnails from "./GalleryThumbnails";
import { useWishlist } from "@/context/wishlist-context";

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

const SWIPE_THRESHOLD = 40;

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
  const { isWishlisted } = useWishlist();
  const isLiked = Boolean(productId !== undefined && isWishlisted(productId));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePrevImage = () => {
    if (!hasImages) return;
    setActiveIdx(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  const handleNextImage = () => {
    if (!hasImages) return;
    setActiveIdx((prev) => (prev + 1) % displayImages.length);
  };

  const touchStartRef = useRef(0);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const delta = endX - touchStartRef.current;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) {
      handleNextImage();
    } else {
      handlePrevImage();
    }
  };

  return (
    <div className="space-y-6">
      <ProductGalleryMainImage
        hasImages={hasImages}
        image={displayImages[activeIdx]}
        alt={name}
        isZooming={isZooming}
        zoomPos={zoomPos}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        isLiked={isLiked}
        productId={productId}
        name={initials(name)}
      />
      {hasImages && (
        <GalleryThumbnails
          images={displayImages}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
        />
      )}
    </div>
  );
};

export default ProductGallery;
