import { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import WishlistButton from "./WishlistButton";
import GalleryImage from "./GalleryImage";
import GalleryThumbnails from "./GalleryThumbnails";
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
      <div
        className="relative aspect-[4/5] bg-[#F9F9F9] rounded-[2.5rem] overflow-hidden group border border-gray-100 cursor-zoom-in shadow-inner"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {hasImages ? (
          <GalleryImage
            src={displayImages[activeIdx]}
            alt={name}
            isZooming={isZooming}
            zoomPos={zoomPos}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">
            {initials(name)}
          </div>
        )}
        {hasImages && (
          <div className="absolute inset-0 pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/70 text-gray-600 shadow-lg backdrop-blur-md flex items-center justify-center transition hover:bg-white pointer-events-auto"
            >
              <span className="sr-only">Previous image</span>
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M15 18l-6-6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/70 text-gray-600 shadow-lg backdrop-blur-md flex items-center justify-center transition hover:bg-white pointer-events-auto"
            >
              <span className="sr-only">Next image</span>
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M9 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <WishlistButton productId={productId} isLiked={isLiked} />
          <button className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-emerald-600 shadow-lg transition-all">
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Zoom Hint */}
        {!isZooming && hasImages && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/10 backdrop-blur-sm px-4 py-2 rounded-full pointer-events-none">
            <p className="text-[10px] uppercase tracking-widest text-gray-600">
              Hover to Zoom
            </p>
          </div>
        )}
      </div>

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
