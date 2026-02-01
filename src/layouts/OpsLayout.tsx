import { Outlet } from "react-router";
import OpsSidebar from "./ops/OpsSidebar";
import OpsHeader from "./ops/OpsHeader";
import type { UserRole } from "@/domains/users/types";

interface OpsLayoutProps {
  userRole?: UserRole | null;
  userName?: string | null;
}

const OpsLayout: React.FC<OpsLayoutProps> = ({ userRole, userName }) => {
  return (
    <div className="min-h-screen flex bg-gray-50/50">
      <OpsSidebar userRole={userRole} userName={userName} />
      <div className="flex-1 ml-64 min-w-0">
        <OpsHeader />
        <main className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OpsLayout;
