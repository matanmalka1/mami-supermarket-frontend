import { Link } from "react-router";
import { Category } from "@/domains/catalog/types";
import PageWrapper from "@/components/ui/PageWrapper";

type StoreFooterProps = {
  categories: Category[];
  loading: boolean;
  onStaticLink: (label: string) => void;
};

const StoreFooter: React.FC<StoreFooterProps> = ({
  categories,
  loading,
  onStaticLink,
}) => (
  <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 py-20">
    <PageWrapper className="space-y-14">
      <div className="grid gap-10 md:grid-cols-[2fr,1fr,1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500 ">
            Mami Supermaket HQ
          </p>
          <h4 className="text-2xl text-slate-900">Natural, local, ready.</h4>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            We partner with trusted farms and fulfillment partners to keep your
            pantry stocked with curated essentials. Expect quick fulfillment and
            consistent quality every time.
          </p>
        </div>

        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-[0.4em] text-slate-400 ">
            Departments
          </h5>
          {loading ? (
            <p className="text-sm text-slate-400">Loading departments…</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-slate-400">Departments unavailable</p>
          ) : (
            <ul className="text-sm text-slate-600 space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/store/category/${cat.id}`}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-[0.4em] text-slate-400 ">
            Customer care
          </h5>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>
              <Link
                to="/store/account/settings"
                className="hover:text-emerald-600 transition-colors"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/store/account/orders"
                className="hover:text-emerald-600 transition-colors"
              >
                Track delivery
              </Link>
            </li>
            <li
              onClick={() => onStaticLink("Our Mission")}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Our Mission
            </li>
            <li
              onClick={() => onStaticLink("Verified Farmers")}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Verified Farmers
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/40 pt-6 text-xs uppercase tracking-[0.35em] text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Mami Supermarket</span>
        <div className="flex flex-wrap gap-4 text-[0.65rem]">
          <Link to="/store/account/settings" className="hover:text-emerald-500">
            Terms
          </Link>
          <Link to="/store/account/orders" className="hover:text-emerald-500">
            Privacy
          </Link>
          <Link to="/store" className="hover:text-emerald-500">
            Store
          </Link>
        </div>
      </div>
    </PageWrapper>
  </footer>
);

export default StoreFooter;
