import React from "react";

interface GalleryImageProps {
  src: string;
  alt?: string;
  isZooming: boolean;
  zoomPos: { x: number; y: number };
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  alt,
  isZooming,
  zoomPos,
}) => (
  <img
    src={src}
    className="w-full h-full object-contain p-12 transition-transform duration-200 ease-out pointer-events-none"
    alt={alt || "Product Detail"}
    style={{
      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
      transform: isZooming ? "scale(2.5)" : "scale(1)",
    }}
  />
);

export default GalleryImage;
