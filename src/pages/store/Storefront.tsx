import Grid from "@/components/ui/Grid";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import { Clock, Leaf, Sparkles } from "lucide-react";
import RecentlyViewed from "@/features/store/recently-viewed/components/RecentlyViewed";
import { BenefitCard } from "@/components/store/StorefrontComponents";
import useStorefront from "@/features/store/storefront/useStorefront";
import {
  useFlashDeals,
  formatSeconds,
} from "@/features/store/flash-deals/flashDealsFeature";
import StorefrontHeroSection from "./StorefrontHeroSection";
import StorefrontCategories from "./StorefrontCategories";
import StorefrontFeatured from "./StorefrontFeatured";
import StorefrontModal from "./StorefrontModal";
import FlashDeals from "@/components/store/FlashDeals";

const Storefront: React.FC = () => {
  const categoryRef = useRef<HTMLDivElement>(null);
  const {
    categories,
    featured,
    loading,
    isFarmModalOpen,
    openFarmModal,
    closeFarmModal,
  } = useStorefront();
  const {
    secondsLeft,
    deals,
    loading: flashLoading,
    error: flashError,
  } = useFlashDeals();
  const flashTimeLeft = formatSeconds(secondsLeft);

  const scrollToCategories = () =>
    categoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
      <StorefrontHeroSection
        onStart={scrollToCategories}
        onExplore={openFarmModal}
      />
      <div ref={categoryRef} className="scroll-mt-32">
        <StorefrontCategories categories={categories} loading={loading} />
      </div>
      <FlashDeals
        deals={deals}
        loading={flashLoading}
        error={flashError}
        timeLeft={flashTimeLeft}
      />
      <StorefrontFeatured featured={featured} loading={loading} />
      <RecentlyViewed />
      <Grid cols={3} gap={12}>
        <BenefitCard
          icon={<Clock />}
          title="1-Hour Delivery"
          desc="Fast, temperature-controlled delivery guaranteed."
          bg="bg-emerald-50"
          color="text-[#008A45]"
        />
        <BenefitCard
          icon={<Leaf />}
          title="Zero-Waste Pack"
          desc="Sustainable packaging for a cleaner planet."
          bg="bg-blue-50"
          color="text-blue-600"
        />
        <BenefitCard
          icon={<Sparkles />}
          title="Certified Organic"
          desc="100% pesticide-free produce from local farms."
          bg="bg-orange-50"
          color="text-orange-500"
        />
      </Grid>
      <StorefrontModal isOpen={isFarmModalOpen} onClose={closeFarmModal} />
    </div>
  );
};

export default Storefront;
