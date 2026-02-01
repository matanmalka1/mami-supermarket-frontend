import Section from "@/components/ui/Section";
import Grid from "@/components/ui/Grid";
import ProductCard from "@/components/store/ProductCard";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { TrendingUp } from "lucide-react";

type Product = any;

interface StorefrontFeaturedProps {
  featured: Product[];
  loading: boolean;
}

const StorefrontFeatured: React.FC<StorefrontFeaturedProps> = ({
  featured,
  loading,
}) => (
  <Section
    title="Today's Selection"
    subtitle={
      <>
        <TrendingUp size={16} className="text-[#008A45]" /> Trending in your
        area
      </>
    }
    linkTo="/store/search"
  >
    {loading ? (
      <div className="py-8">
        <LoadingState label="Loading featured products..." />
      </div>
    ) : featured.length === 0 ? (
      <div className="py-8">
        <EmptyState
          title="No featured products"
          description="We’ll refresh the spotlight soon."
        />
      </div>
    ) : (
      <Grid>
        {featured.map((item: any) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </Grid>
    )}
  </Section>
);

export default StorefrontFeatured;
