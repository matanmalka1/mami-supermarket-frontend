import { Link } from "react-router";
import { User, Package, MapPin, LogOut, LayoutDashboard } from "lucide-react";

interface AccountDropdownProps {
  onClose: () => void;
  userRole?: string | null;
  onLogout: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({
  onClose,
  userRole,
  onLogout,
}) => {
  const isActuallyAdmin = userRole === "ADMIN";

  return (
    <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-gray-100 rounded-3xl shadow-2xl p-2 animate-in slide-in-from-top-2 overflow-hidden">
      <div
        className={`px-4 py-4 border-b mb-1 ${isActuallyAdmin ? "bg-teal-50/30" : "bg-gray-50/50"}`}
      >
        <p className="text-sm ">
          {isActuallyAdmin ? "Administrator" : "Customer Account"}
        </p>
        <div
          className={`text-[9px] uppercase tracking-widest flex items-center gap-1.5 mt-0.5 ${isActuallyAdmin ? "text-teal-600" : "text-emerald-600"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${isActuallyAdmin ? "bg-teal-500" : "bg-emerald-500"}`}
          />
          {isActuallyAdmin ? "Active Admin Session" : "Active Session"}
        </div>
      </div>

      {isActuallyAdmin && (
        <div className="p-2 space-y-1">
          <Link
            to="/"
            onClick={() => {
              onClose();
              sessionStorage.removeItem("mami_manual_store_visit");
            }}
            className="flex items-center gap-3 p-3 rounded-xl bg-teal-900 text-white transition-all text-xs  tracking-tight border border-teal-700 shadow-lg shadow-teal-900/20 hover:bg-teal-800"
          >
            <LayoutDashboard size={16} className="text-teal-300" /> ENTER ADMIN
            PORTAL
          </Link>
          <div className="h-px bg-gray-100 my-2" />
        </div>
      )}

      {[
        {
          label: "Profile Settings",
          icon: User,
          path: "/store/account/settings",
        },
        { label: "My Orders", icon: Package, path: "/store/account/orders" },
        { label: "Addresses", icon: MapPin, path: "/store/account/addresses" },
      ].map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClose}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-gray-500 hover:text-[#008A45] transition-all text-xs font-bold"
        >
          <link.icon size={16} /> {link.label}
        </Link>
      ))}
      <div className="h-px bg-gray-100 my-1" />
      <button
        onClick={() => {
          onLogout();
          window.location.reload();
        }}
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-400 transition-all text-xs font-bold"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
};

export default AccountDropdown;
