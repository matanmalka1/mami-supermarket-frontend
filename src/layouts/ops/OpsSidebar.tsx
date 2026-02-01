import type { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { GripVertical, Settings, Store } from "lucide-react";
import AvatarBadge from "@/components/ui/AvatarBadge";
import type { UserRole } from "@/domains/users/types";
import { normalizeRole, isOpsRole } from "@/utils/roles";
import { navGroups } from "./sidebar/navigation-config";

interface OpsSidebarProps {
  userRole?: UserRole | null;
  userName?: string | null;
}

const OpsSidebar: FC<OpsSidebarProps> = ({ userRole, userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const effectiveRole = normalizeRole(userRole);
  if (!effectiveRole || !isOpsRole(effectiveRole)) return null;

  const isActive = (path: string) => location.pathname === path;
  const visibleGroups = navGroups.filter(
    ({ roles }) => !roles || roles.includes(effectiveRole),
  );

  const handleGoToStore = () => {
    sessionStorage.setItem("mami_manual_store_visit", "true");
    navigate("/store");
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col fixed inset-y-0 z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#006666] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-900/20">
            <GripVertical size={24} />
          </div>
          <div>
            <h1 className="text-lg leading-tight tracking-tight text-gray-900 ">
              Ops Portal
            </h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
              Mami Supermarket
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-8 py-4 overflow-y-auto no-scrollbar">
        {visibleGroups.map(({ title, items }) => (
          <div key={title} className="space-y-2">
            <p className="px-4 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
              {title}
            </p>
            <nav className="space-y-1">
              {items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active
                        ? "bg-emerald-50 text-[#006666] font-bold shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={
                        active
                          ? "text-[#006666]"
                          : "text-gray-400 group-hover:text-gray-600"
                      }
                    />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-6 border-t bg-gray-50/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <AvatarBadge
              name={userName || "Admin User"}
              size={40}
              className="shadow-sm border-2 border-white"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {userName || "Admin User"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/settings")}
          className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Settings size={14} /> Account Settings
        </button>
        <button
          onClick={handleGoToStore}
          className="w-full flex items-center justify-center gap-2 mt-4 text-[10px] text-[#006666] uppercase tracking-[0.2em] hover:underline"
        >
          <Store size={14} /> Customer Hub
        </button>
      </div>
    </aside>
  );
};

export default OpsSidebar;
