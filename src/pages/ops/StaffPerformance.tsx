import React from 'react';
import { Info } from 'lucide-react';
import Button from '../components/ui/Button';

const StaffPerformance: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex items-end justify-between border-b pb-8">
        <div>
          <h1 className="text-5xl font-black italic text-gray-900 tracking-tighter">Performance Hub</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Operational Analytics</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-black uppercase tracking-[0.2em]">
          <Info size={14} /> Performance metrics not available yet
        </div>
        <p className="text-sm font-bold text-gray-500 max-w-2xl mx-auto">
          Live picker analytics and staff performance dashboards are pending backend support. No simulated or random data is shown.
        </p>
        <Button variant="outline" onClick={() => window.location.hash = '#/inventory'}>
          Go to Inventory
        </Button>
      </div>
    </div>
  );
};

export default StaffPerformance;
