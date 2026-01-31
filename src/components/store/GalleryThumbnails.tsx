interface GalleryThumbnailsProps {
  images: string[];
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
}

const GalleryThumbnails: React.FC<GalleryThumbnailsProps> = ({
  images,
  activeIdx,
  setActiveIdx,
}) => (
  <div className="grid grid-cols-4 gap-4">
    {images.map((img, i) => (
      <button
        key={i}
        onClick={() => setActiveIdx(i)}
        className={`aspect-square rounded-2xl bg-[#F9F9F9] overflow-hidden border-2 transition-all group ${
          activeIdx === i
            ? "border-emerald-500 shadow-lg scale-[0.98]"
            : "border-transparent hover:border-gray-200"
        } p-1`}
      >
        <img
          src={img}
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
          alt={`Thumbnail ${i + 1}`}
        />
      </button>
    ))}
  </div>
);

export default GalleryThumbnails;
