import React from "react";
import { Link } from "react-router";
import Grid from "@/components/ui/Grid";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";

type Category = {
  id: number;
  name: string;
  icon_slug?: string;
  icon?: string;
};

interface StorefrontCategoriesProps {
  categories: Category[];
  loading: boolean;
}

const StorefrontCategories: React.FC<StorefrontCategoriesProps> = ({
  categories,
  loading,
}) => (
  <div>
    {loading ? (
      <div className="py-8">
        <LoadingState label="Loading categories..." />
      </div>
    ) : categories.length === 0 ? (
      <div className="py-8">
        <EmptyState
          title="No categories available"
          description="Our catalog is syncing. Check back soon."
        />
      </div>
    ) : (
      <Grid cols={6} gap={6}>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/store/category/${cat.id}`}
            className="group flex flex-col items-center p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:border-[#008A45] hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-center space-y-4"
          >
            <span className="text-4xl group-hover:scale-125 transition-transform">
              {cat.icon_slug || cat.icon || "🛒"}
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-[#008A45]">
              {cat.name}
            </span>
          </Link>
        ))}
      </Grid>
    )}
  </div>
);

export default StorefrontCategories;
