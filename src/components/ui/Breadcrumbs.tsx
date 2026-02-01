import React from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link, useLocation } from "react-router";
import { ChevronRight, Home } from "lucide-react";

const PATH_MAP: Record<string, string> = {
  store: "Home",
  category: "Departments",
  product: "Catalog",
  checkout: "Secure Checkout",
  account: "My Account",
  orders: "Order History",
  addresses: "Address Book",
  settings: "Profile Settings",
  search: "Search Results",
  produce: "Fresh Produce",
  dairy: "Dairy & Eggs",
  bakery: "Bakery",
  meat: "Meat & Poultry",
  drinks: "Beverages",
  pantry: "Pantry Essentials",
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0 || location.pathname === "/store") return null;

  return (
    <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
      <Link
        to="/store"
        className="flex items-center gap-1.5 hover:text-[#008A45] transition-colors"
      >
        <Home size={12} />
        <span>Market</span>
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = PATH_MAP[value] || value.replace(/-/g, " ");

        return (
          <React.Fragment key={to}>
            <ChevronRight size={10} className="shrink-0 text-gray-300" />
            {last ? (
              <span className="text-[#008A45] truncate max-w-[150px]" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={to} className="hover:text-gray-600 transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
