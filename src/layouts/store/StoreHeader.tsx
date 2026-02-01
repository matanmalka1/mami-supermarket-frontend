import React, { useState } from "react";
import { Link } from "react-router";
import {
  ShoppingBag,
  ChevronDown,
  Grid as GridIcon,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import SearchTypeahead from "./header/SearchTypeahead";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/useAuth";
import DeptMegaMenu from "./header/DeptMegaMenu";
import { useCatalogCategories } from "@/features/store/hooks/useCatalogCategories";
import HeaderActions from "./header/HeaderActions";
import BranchSelector from "./header/BranchSelector";
import PageWrapper from "@/components/ui/PageWrapper";

const StoreHeader: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<
    "notif" | "account" | "dept" | null
  >(null);
  const { setIsOpen, items } = useCart();
  const { userRole, userName, logout } = useAuth();
  const { categories, loading: categoriesLoading } = useCatalogCategories();
  const notifications: any[] = [];

  const isActuallyAdmin = userRole === "ADMIN";

  return (
    <div className="flex flex-col sticky top-0 z-50">
      {isActuallyAdmin && (
        <div className="bg-[#003333] text-white py-2.5 px-6 flex items-center justify-between border-b border-teal-800 shadow-2xl animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 p-1.5 rounded-lg border border-teal-500/30 animate-pulse">
              <ShieldCheck size={16} className="text-teal-400" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em]">
              System Admin Session{" "}
              <span className="text-teal-400 ml-2 opacity-60">
                • Operational Override Active
              </span>
            </p>
          </div>
          <Link
            to="/"
            onClick={() => sessionStorage.removeItem("mami_manual_store_visit")}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-[#003333] px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all shadow-xl group"
          >
            Switch to Ops Portal{" "}
            <LayoutDashboard
              size={14}
              className="group-hover:rotate-12 transition-transform"
            />
          </Link>
        </div>
      )}

      <header className="border-b bg-white/95 backdrop-blur-md shadow-sm">
        <PageWrapper className="h-20 flex items-center justify-between gap-6 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              to="/store"
              className="flex items-center gap-2 text-[#008A45] text-2xl tracking-tighter shrink-0"
              onClick={() => setActiveMenu(null)}
            >
              <div className="w-10 h-10 bg-[#008A45] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
                <ShoppingBag size={24} />
              </div>
              Mami Supermarket
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setActiveMenu(activeMenu === "dept" ? null : "dept")
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-widest transition-all `}
              >
                <GridIcon size={16} /> Departments{" "}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    activeMenu === "dept" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className="h-4 w-px bg-gray-100 mx-2" />
              <BranchSelector />
            </nav>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <SearchTypeahead onNavigate={() => setActiveMenu(null)} />
          </div>

          <div className="flex items-center gap-3">
            <HeaderActions
              isActuallyAdmin={isActuallyAdmin}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              itemsCount={items.reduce((sum, i) => sum + i.quantity, 0)}
              setIsOpen={setIsOpen}
              notifications={notifications}
              userRole={userRole}
              userName={userName}
              logout={logout}
            />
          </div>
        </PageWrapper>

        {activeMenu === "dept" && (
          <DeptMegaMenu
            items={categories}
            loading={categoriesLoading}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </header>
    </div>
  );
};

export default StoreHeader;
