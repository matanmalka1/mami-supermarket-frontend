import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100 mt-8">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {totalItems
          ? `Showing page ${currentPage} of ${totalPages} (${totalItems} items)`
          : `Page ${currentPage} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-12 h-12 p-0 rounded-xl"
        >
          <ChevronLeft size={18} />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-xl text-xs transition-all ${
                  currentPage === pageNum
                    ? "bg-[#006666] text-white shadow-lg shadow-teal-900/10"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-12 h-12 p-0 rounded-xl"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
