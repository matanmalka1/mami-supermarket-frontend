import { Bell, ShoppingCart, Lock } from "lucide-react";
import { Link } from "react-router";
import NotifDropdown from "../store-header/NotifDropdown";
import AccountDropdown from "../store-header/AccountDropdown";
import AvatarBadge from "../../ui/AvatarBadge";

type HeaderActionsProps = {
  isActuallyAdmin: boolean;
  activeMenu: "notif" | "account" | "dept" | null;
  setActiveMenu: (value: "notif" | "account" | "dept" | null) => void;
  itemsCount: number;
  setIsOpen: (open: boolean) => void;
  notifications: any[];
  userRole: string | null;
  logout: () => void;
};

const HeaderActions: React.FC<HeaderActionsProps> = ({
  isActuallyAdmin,
  activeMenu,
  setActiveMenu,
  itemsCount,
  setIsOpen,
  notifications,
  userRole,
  logout,
}) => (
  <div className="flex items-center gap-3">
    {isActuallyAdmin && (
      <Link
        to="/"
        onClick={() => sessionStorage.removeItem("mami_manual_store_visit")}
        className="hidden md:flex items-center gap-2 bg-[#006666] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-teal-900/20 hover:bg-[#005555] transition-all  border border-teal-400/20"
      >
        <Lock size={14} /> OPS PORTAL
      </Link>
    )}

    <div className="relative">
      <button
        onClick={() => setActiveMenu(activeMenu === "notif" ? null : "notif")}
        className={`p-2.5 transition-all rounded-xl hover:bg-gray-50 ${
          activeMenu === "notif" ? "text-[#008A45] bg-emerald-50" : "text-gray-400"
        }`}
      >
        <Bell size={22} />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>
      {activeMenu === "notif" && (
        <NotifDropdown items={notifications} onClose={() => setActiveMenu(null)} />
      )}
    </div>

    <button
      onClick={() => {
        setIsOpen(true);
        setActiveMenu(null);
      }}
      className="p-2.5 text-gray-400 hover:text-[#008A45] hover:bg-gray-50 rounded-xl relative transition-all"
    >
      <ShoppingCart size={22} />
      {itemsCount > 0 && (
        <span className="absolute top-1.5 right-1.5 bg-[#008A45] text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-md">
          {itemsCount}
        </span>
      )}
    </button>

    <div className="relative ml-2">
      <div
        onClick={() => setActiveMenu(activeMenu === "account" ? null : "account")}
        className={`w-10 h-10 rounded-xl bg-gray-50 border-2 overflow-hidden cursor-pointer transition-all shadow-sm flex items-center justify-center ${
          activeMenu === "account"
            ? "border-[#008A45] ring-4 ring-emerald-50"
            : "border-transparent hover:border-emerald-100"
        }`}
      >
        <AvatarBadge name={isActuallyAdmin ? "Admin User" : "Customer"} size={36} className="border-0" />
      </div>
      {activeMenu === "account" && (
        <AccountDropdown onClose={() => setActiveMenu(null)} userRole={userRole} onLogout={logout} />
      )}
    </div>
  </div>
);

export default HeaderActions;
