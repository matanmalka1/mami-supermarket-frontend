import React from "react";
import PaginationControls from "./PaginationControls";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const CategoryPagination: React.FC<CategoryPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPrev={() => setCurrentPage(Math.max(1, currentPage - 1))}
      onNext={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
    />
  );
};

export default CategoryPagination;
