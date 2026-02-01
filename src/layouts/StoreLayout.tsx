import React, { useState } from "react";
import { Link, Outlet } from "react-router";
import StoreHeader from "./store/StoreHeader";
import PageWrapper from "@/components/ui/PageWrapper";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useCatalogCategories } from "@/features/store/hooks/useCatalogCategories";
import { BranchProvider } from "@/context/BranchContext";
import StoreFooter from "./store/StoreFooter";
import StoreInfoModal from "./store/StoreInfoModal";

const StoreLayout: React.FC = () => {
  const [infoModal, setInfoModal] = useState<{
    isOpen: boolean;
    title: string;
  } | null>(null);
  const { categories, loading } = useCatalogCategories();

  const handleStaticLink = (label: string) => {
    setInfoModal({ isOpen: true, title: label });
  };

  return (
    <BranchProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <StoreHeader />
        <main className="flex-1 w-full py-8">
          <PageWrapper className="space-y-8">
            <Breadcrumbs />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] uppercase tracking-[0.4em] text-gray-400">
                Heart an item and we will keep it ready for later
              </p>
              <Link
                to="/store/wishlist"
                className="text-xs uppercase tracking-[0.3em] text-[#008A45] border-b border-[#008A45]/0 hover:border-b hover:border-[#008A45] transition-all"
              >
                View wishlist
              </Link>
            </div>
            <Outlet />
          </PageWrapper>
        </main>
        <StoreFooter
          categories={categories}
          loading={loading}
          onStaticLink={handleStaticLink}
        />
      </div>
      <StoreInfoModal
        infoModal={infoModal}
        onClose={() => setInfoModal(null)}
      />
    </BranchProvider>
  );
};

export default StoreLayout;
