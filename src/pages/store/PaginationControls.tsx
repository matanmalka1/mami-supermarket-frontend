interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => (
  <div className="flex justify-center items-center gap-4 mt-8">
    <button
      onClick={onPrev}
      disabled={currentPage === 1}
      className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <span className="text-base font-medium text-gray-700 px-2">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
);

export default PaginationControls;
