import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  Activity,
  PackagePlus,
  Tag,
  CheckSquare,
  CalendarClock,
  Settings2,
  BarChart3,
} from "lucide-react";
import type { UserRole } from "@/domains/users/types";

export type NavItem = { label: string; icon: LucideIcon; path: string };
export type NavGroup = { title: string; items: NavItem[]; roles?: UserRole[] };

/**
 * Navigation groups configuration for Ops Portal
 */
export const navGroups: NavGroup[] = [
  {
    title: "Operations",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/" },
      { label: "Inventory", icon: Box, path: "/inventory" },
      { label: "Stock Reports", icon: PackagePlus, path: "/stock-requests" },
      { label: "Performance", icon: Activity, path: "/performance" },
    ],
  },
  {
    title: "Management",
    roles: ["ADMIN"],
    items: [
      { label: "Catalog Manager", icon: Tag, path: "/admin/catalog" },
      { label: "Approve Stock", icon: CheckSquare, path: "/admin/requests" },
      { label: "Delivery Slots", icon: CalendarClock, path: "/admin/delivery" },
      { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
      { label: "Global Settings", icon: Settings2, path: "/admin/settings" },
      { label: "Audit Logs", icon: ClipboardList, path: "/audit" },
    ],
  },
];
