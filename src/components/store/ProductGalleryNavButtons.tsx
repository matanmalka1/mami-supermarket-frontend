import React from "react";

interface ProductGalleryNavButtonsProps {
  onPrev: () => void;
  onNext: () => void;
}

const ProductGalleryNavButtons: React.FC<ProductGalleryNavButtonsProps> = ({
  onPrev,
  onNext,
}) => (
  <div className="absolute inset-0 pointer-events-none">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onPrev();
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
        onNext();
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
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);

export default ProductGalleryNavButtons;
