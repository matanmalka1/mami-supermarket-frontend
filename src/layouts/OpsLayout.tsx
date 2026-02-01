import type { FC, ReactNode } from "react";
import { Outlet } from "react-router";
import OpsSidebar from "@/components/layout/OpsSidebar";
import OpsHeader from "@/components/layout/OpsHeader";
import type { UserRole } from "@/domains/users/types";

interface OpsLayoutProps {
  userRole?: UserRole | null;
  children?: ReactNode;
}

const OpsLayout: FC<OpsLayoutProps> = ({ userRole, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <OpsSidebar userRole={userRole} />
      <div className="ml-64 flex min-h-screen flex-col">
        <OpsHeader />
        <main className="flex-1 overflow-y-auto px-6 pb-10 pt-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default OpsLayout;
