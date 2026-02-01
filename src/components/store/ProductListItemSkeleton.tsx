import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const ProductListItemSkeleton: React.FC = () => (
  <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <Skeleton className="h-64 w-full rounded-2xl md:h-32 md:w-32" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <div className="flex flex-col gap-3 md:flex-shrink-0">
        <Skeleton className="h-10 w-32 rounded-2xl" />
        <Skeleton className="h-10 w-10 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default ProductListItemSkeleton;
