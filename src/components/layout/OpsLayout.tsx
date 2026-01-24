
import React from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Outlet } from 'react-router';
import OpsSidebar from './OpsSidebar';
import OpsHeader from './OpsHeader';

interface OpsLayoutProps {
  userRole?: 'ADMIN' | 'USER' | null;
}

const OpsLayout: React.FC<OpsLayoutProps> = ({ userRole }) => {
  return (
    <div className="min-h-screen flex bg-gray-50/50">
      <OpsSidebar userRole={userRole} />
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
