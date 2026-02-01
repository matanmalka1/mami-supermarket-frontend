import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  Package,
  MapPin,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AvatarBadge from "@/components/ui/AvatarBadge";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

interface AccountLayoutProps {
  onLogout: () => void;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useUserProfile();

  const profileName =
    user?.fullName ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "Customer";

  const menuItems = [
    { label: "My Orders", icon: Package, path: "orders" },
    { label: "Addresses", icon: MapPin, path: "addresses" },
    { label: "Profile Settings", icon: User, path: "settings" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-12 gap-12">
      <aside className="col-span-12 lg:col-span-3 space-y-8">
        <div className="bg-gray-50/50 rounded-[2.5rem] p-8 space-y-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <AvatarBadge
              name={profileName}
              size={64}
              className="rounded-2xl border-4 border-white shadow-md"
            />
            <div>
              <h2 className="text-xl  tracking-tight">{profileName}</h2>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center justify-between p-4 rounded-2xl transition-all font-bold group
                  ${isActive ? "bg-white text-[#008A45] shadow-md border border-emerald-50" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 font-bold transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="col-span-12 lg:col-span-9 animate-in fade-in duration-700">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;
