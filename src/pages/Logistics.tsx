
import React, { useState } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from 'react-router';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import Grid from '../components/ui/Grid';
import { Truck, MapPin, Navigation, Activity } from 'lucide-react';
import { MOCK_VEHICLES } from '../constants';

const Logistics: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ON ROUTE' | 'LOADING' | 'RETURNING'>('ALL');

  const filteredVehicles = MOCK_VEHICLES.filter(v => {
    if (filter === 'ALL') return true;
    return v.status === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Logistics Command</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time Fleet & Route Status</p>
        </div>
        <Link to="/fleet">
          <button className="bg-[#006666] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-[#005555] transition-all">
            <Activity size={18} /> Launch Live Fleet Map
          </button>
        </Link>
      </div>

      <Grid cols={4} gap={6}>
        <StatCard label="Active Drivers" value="12" sub="8 currently on route" />
        <StatCard label="Pending Pickups" value="42" sub="Next hour peak" />
        <StatCard label="Avg. Delivery" value="22m" trend="-4m" />
        <StatCard label="Fuel Efficiency" value="94%" trend="+2%" />
      </Grid>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b flex items-center justify-between bg-gray-50/30">
          <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Live Vehicle Timeline</h3>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
            {['ALL', 'ON ROUTE', 'LOADING', 'RETURNING'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`transition-all hover:underline ${filter === f ? 'text-[#006666]' : 'text-gray-300'}`}
              >
                {f.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors group animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-2 transition-transform group-hover:scale-105 ${
                  v.status === 'ON ROUTE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  v.status === 'LOADING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}>
                  <Truck size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-2xl italic text-gray-900">{v.driver}</h4>
                  <p className="text-xs text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2">
                    <MapPin size={14} /> {v.id} • {v.load} capacity
                  </p>
                </div>
              </div>
              <div className="text-right space-y-3">
                <StatusBadge status={v.status} />
                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-end gap-2">
                  <Navigation size={12} className="text-[#006666]" /> ETA: <span className="text-gray-900">{v.eta}</span>
                </p>
              </div>
            </div>
          ))}
          {filteredVehicles.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest italic">
              No vehicles in this state.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logistics;
