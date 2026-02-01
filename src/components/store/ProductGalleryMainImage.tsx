import React from "react";
import GalleryImage from "./GalleryImage";
import ProductGalleryNavButtons from "./ProductGalleryNavButtons";
import ProductGalleryControls from "./ProductGalleryControls";
import ProductGalleryZoomHint from "./ProductGalleryZoomHint";

interface ProductGalleryMainImageProps {
  hasImages: boolean;
  image: string | undefined;
  alt?: string;
  isZooming: boolean;
  zoomPos: { x: number; y: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
  onPrev: () => void;
  onNext: () => void;
  isLiked: boolean;
  productId?: number;
  name?: string;
}

const ProductGalleryMainImage: React.FC<ProductGalleryMainImageProps> = ({
  hasImages,
  image,
  alt,
  isZooming,
  zoomPos,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onTouchStart,
  onTouchEnd,
  onPrev,
  onNext,
  isLiked,
  productId,
  name,
}) => (
  <div
    className="relative aspect-[4/5] bg-[#F9F9F9] rounded-[2.5rem] overflow-hidden group border border-gray-100 cursor-zoom-in shadow-inner"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onMouseMove={onMouseMove}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    {hasImages ? (
      <GalleryImage
        src={image ?? ""}
        alt={alt}
        isZooming={isZooming}
        zoomPos={zoomPos}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">
        {name}
      </div>
    )}
    {hasImages && <ProductGalleryNavButtons onPrev={onPrev} onNext={onNext} />}
    <ProductGalleryControls isLiked={isLiked} productId={productId} />
    {!isZooming && hasImages && <ProductGalleryZoomHint />}
  </div>
);

export default ProductGalleryMainImage;
