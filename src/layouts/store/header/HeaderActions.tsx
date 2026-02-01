import { Bell, ShoppingCart, Lock } from "lucide-react";
import NotifDropdown from "./NotifDropdown";
import AccountDropdown from "./AccountDropdown";
import AvatarBadge from "@/components/ui/AvatarBadge";
import type { OpsAlert } from "@/domains/notifications/types";
import type { UserRole } from "@/domains/users/types";

type HeaderActionsProps = {
  isActuallyAdmin: boolean;
  activeMenu: "notif" | "account" | "dept" | null;
  setActiveMenu: (value: "notif" | "account" | "dept" | null) => void;
  itemsCount: number;
  setIsOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  userRole: UserRole | null;
  userName: string | null;
  logout: () => void;
};

type NotificationItem = OpsAlert;

const HeaderActions: React.FC<HeaderActionsProps> = ({
  isActuallyAdmin,
  activeMenu,
  setActiveMenu,
  itemsCount,
  setIsOpen,
  notifications,
  userRole,
  userName,
  logout,
}) => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <button
        onClick={() => setActiveMenu(activeMenu === "notif" ? null : "notif")}
        aria-expanded={activeMenu === "notif"}
        aria-label="Notifications"
        className={`p-2.5 transition-all rounded-xl hover:bg-gray-50 ${
          activeMenu === "notif"
            ? "text-[#008A45] bg-emerald-50"
            : "text-gray-400"
        }`}
      >
        <Bell size={22} />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>
      {activeMenu === "notif" && (
        <NotifDropdown
          items={notifications}
          onClose={() => setActiveMenu(null)}
        />
      )}
    </div>

    <button
      onClick={() => {
        setIsOpen(true);
        setActiveMenu(null);
      }}
      aria-label="Open cart"
      className="p-2.5 text-gray-400 hover:text-[#008A45] hover:bg-gray-50 rounded-xl relative transition-all"
    >
      <ShoppingCart size={22} />
      {itemsCount > 0 && (
        <span className="absolute top-1.5 right-1.5 bg-[#008A45] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
          {itemsCount}
          <span className="sr-only">{itemsCount} items in cart</span>
        </span>
      )}
    </button>

    <div className="relative ml-2">
      <button
        type="button"
        aria-expanded={activeMenu === "account"}
        aria-label="Account menu"
        onClick={() =>
          setActiveMenu(activeMenu === "account" ? null : "account")
        }
        className={`w-10 h-10 rounded-xl bg-gray-50 border-2 overflow-hidden transition-all shadow-sm flex items-center justify-center ${
          activeMenu === "account"
            ? "border-[#008A45] ring-4 ring-emerald-50"
            : "border-transparent hover:border-emerald-100"
        }`}
      >
        <AvatarBadge
          name={isActuallyAdmin ? "Admin User" : "Customer"}
          size={36}
          className="border-0"
        />
      </button>
      {activeMenu === "account" && (
        <AccountDropdown
          onClose={() => setActiveMenu(null)}
          userRole={userRole}
          userName={userName}
          onLogout={logout}
        />
      )}
    </div>
  </div>
);

export default HeaderActions;
