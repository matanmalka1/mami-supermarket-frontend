import React from "react";

const ProductGalleryZoomHint: React.FC = () => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/10 backdrop-blur-sm px-4 py-2 rounded-full pointer-events-none">
    <p className="text-[10px] uppercase tracking-widest text-gray-600">
      Hover to Zoom
    </p>
  </div>
);

export default ProductGalleryZoomHint;
