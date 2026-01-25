import { Link } from "react-router";
import { Lock } from "lucide-react";
import { Category } from "@/types/domain";
import PageWrapper from "../shared/PageWrapper";

type StoreFooterProps = {
  categories: Category[];
  loading: boolean;
  onStaticLink: (label: string) => void;
};

const StoreFooter: React.FC<StoreFooterProps> = ({ categories, loading, onStaticLink }) => (
  <footer className="bg-gray-50 border-t py-20">
    <PageWrapper className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <h4 className="font-black text-sm uppercase tracking-widest">
            Departments
          </h4>
          {loading ? (
            <p className="text-sm text-gray-400 font-bold">
              Loading departments...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-400 font-bold">
              Departments unavailable (backend feed missing)
            </p>
          ) : (
            <ul className="text-sm text-gray-500 space-y-3 font-medium">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/store/category/${cat.id}`}
                    className="hover:text-[#008A45] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-6">
          <h4 className="font-black text-sm uppercase tracking-widest">
            About FreshMarket
          </h4>
          <ul className="text-sm text-gray-500 space-y-3 font-medium">
            <li
              onClick={() => onStaticLink("Our Mission")}
              className="hover:text-[#008A45] cursor-pointer transition-colors"
            >
              Our Mission
            </li>
            <li
              onClick={() => onStaticLink("Verified Farmers")}
              className="hover:text-[#008A45] cursor-pointer transition-colors"
            >
              Verified Farmers
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="font-black text-sm uppercase tracking-widest">
            Client Care
          </h4>
          <ul className="text-sm text-gray-500 space-y-3 font-medium">
            <li>
              <Link
                to="/store/account/settings"
                className="hover:text-[#008A45] transition-colors"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/store/account/orders"
                className="hover:text-[#008A45] transition-colors"
              >
                Track Delivery
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-10">
          <div className="space-y-4">
            <h4 className="font-black text-sm uppercase tracking-widest">
              Internal Access
            </h4>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#008A45]/5 text-[#008A45] px-4 py-2.5 rounded-xl text-xs font-black hover:bg-[#008A45]/10 transition-all italic border border-emerald-100"
            >
              <Lock size={14} /> OPS PORTAL
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  </footer>
);

export default StoreFooter;
