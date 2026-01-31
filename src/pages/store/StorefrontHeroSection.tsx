import React from "react";
import { HeroSection } from "@/components/store/StorefrontComponents";

interface StorefrontHeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

const StorefrontHeroSection: React.FC<StorefrontHeroSectionProps> = ({
  onStart,
  onExplore,
}) => <HeroSection onStart={onStart} onExplore={onExplore} />;

export default StorefrontHeroSection;
