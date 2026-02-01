import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-square rounded-2xl" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-8 py-6">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);
