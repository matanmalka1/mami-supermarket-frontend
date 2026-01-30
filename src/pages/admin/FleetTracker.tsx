
import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Navigation, Activity, Layers, ArrowLeft, Info } from 'lucide-react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link, useNavigate } from 'react-router';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

const MOCK_DRIVERS = [
  { id: 'D-1', name: 'Marco R.', pos: { x: 200, y: 150 }, status: 'ON ROUTE', items: 12 },
  { id: 'D-2', name: 'Elena P.', pos: { x: 500, y: 300 }, status: 'LOADING', items: 4 },
  { id: 'D-3', name: 'Chen W.', pos: { x: 350, y: 400 }, status: 'EN ROUTE', items: 8 },
];

const FleetTracker: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'satellite'>('standard');

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        pos: {
          x: d.pos.x + (Math.random() * 4 - 2),
          y: d.pos.y + (Math.random() * 4 - 2)
        }
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleViewRoute = (name: string) => {
    toast(`Calculating stop-sequence for ${name}...`, { icon: '🗺️' });
    setTimeout(() => {
      navigate('/logistics');
    }, 2000);
  };

  const toggleLayer = () => {
    setViewMode(viewMode === 'standard' ? 'satellite' : 'standard');
    toast(`Switched to ${viewMode === 'standard' ? 'Satellite' : 'Standard'} map view`, { icon: '🛰️' });
  };

  const centerMap = () => {
    toast.success("Recentering map on Central Hub Cluster", { icon: '🎯' });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Link to="/logistics" className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest mb-4 group">
            <ArrowLeft size={14} /> Back to Command
          </Link>
          <h1 className="text-5xl font-black  tracking-tighter">Fleet Live</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Real-time Tel Aviv Cluster Monitoring</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl flex items-center gap-3 border border-emerald-100">
             <Activity size={20} className="animate-pulse" />
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Fleet Pulse</span>
                <span className="font-black text-xl ">98.4% Efficiency</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Map View */}
        <div className={`col-span-12 lg:col-span-9 border-8 border-white rounded-[4rem] shadow-2xl relative min-h-[700px] overflow-hidden transition-colors duration-500 ${viewMode === 'satellite' ? 'bg-emerald-950' : 'bg-gray-50'}`}>
           {/* Mock City SVG Map */}
           <svg viewBox="0 0 800 600" className={`w-full h-full transition-opacity ${viewMode === 'satellite' ? 'opacity-30' : 'opacity-60'}`}>
             <defs>
               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className={viewMode === 'satellite' ? 'text-emerald-800' : 'text-gray-200'} />
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
             
             {/* Main Arteries */}
             <path d="M 0 300 Q 400 250 800 300" fill="none" stroke={viewMode === 'satellite' ? "#064e3b" : "#E2E8F0"} strokeWidth="20" strokeLinecap="round" />
             <path d="M 400 0 L 400 600" fill="none" stroke={viewMode === 'satellite' ? "#064e3b" : "#E2E8F0"} strokeWidth="15" strokeLinecap="round" />

             {/* Drivers */}
             {drivers.map(d => (
               <g key={d.id} onClick={() => setSelectedDriver(d.id)} className="cursor-pointer transition-all duration-1000">
                 <circle cx={d.pos.x} cy={d.pos.y} r="16" className={`${selectedDriver === d.id ? 'fill-emerald-500 scale-125' : 'fill-white'} stroke-emerald-500 stroke-4 transition-all`} />
                 <Truck x={d.pos.x - 8} y={d.pos.y - 8} size={16} className={`${selectedDriver === d.id ? 'text-white' : 'text-emerald-500'}`} />
                 <text x={d.pos.x} y={d.pos.y + 35} textAnchor="middle" className={`text-[10px] font-black uppercase tracking-widest ${viewMode === 'satellite' ? 'fill-emerald-200' : 'fill-gray-400'}`}>{d.name}</text>
               </g>
             ))}
           </svg>

           {/* Map Controls */}
           <div className="absolute top-8 left-8 flex flex-col gap-3">
              <button 
                onClick={toggleLayer}
                className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all border shadow-sm ${viewMode === 'satellite' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-gray-400 hover:text-emerald-600 border-gray-100'}`}
              >
                <Layers size={20} />
              </button>
              <button 
                onClick={centerMap}
                className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors border border-gray-100 shadow-sm active:scale-90"
              >
                <Navigation size={20} />
              </button>
           </div>

           {/* Floating Legend */}
           <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-6 rounded-3xl border border-white shadow-2xl space-y-4 w-64">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cluster Status</h4>
              <div className="space-y-2">
                 <div className="flex items-center justify-between text-xs font-bold"><span>Active En-Route</span><span className="text-emerald-500">8</span></div>
                 <div className="flex items-center justify-between text-xs font-bold"><span>Loading Dock</span><span className="text-orange-500">4</span></div>
                 <div className="flex items-center justify-between text-xs font-bold"><span>Standby</span><span className="text-gray-400">2</span></div>
              </div>
           </div>
        </div>

        {/* Details Panel */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
           {selectedDriver ? ( drivers.filter(d => d.id === selectedDriver).map(d => (
             <div key={d.id} className="bg-white border border-emerald-100 rounded-[3rem] p-8 shadow-xl space-y-8 animate-in slide-in-from-right-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Truck size={32} /></div>
                  <div>
                    <h3 className="text-2xl font-black ">{d.name}</h3>
                    <Badge color="emerald">{d.status}</Badge>
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t">
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-400 uppercase tracking-widest">Active Orders</span>
                      <span className="font-black  text-lg">{d.items}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-400 uppercase tracking-widest">Load Capacity</span>
                      <div className="w-32 h-2 bg-gray-50 rounded-full overflow-hidden border">
                         <div className="h-full bg-emerald-500 w-[65%]" />
                      </div>
                   </div>
                   <Button fullWidth size="md" className="rounded-2xl mt-4" onClick={() => handleViewRoute(d.name)}>View Full Route</Button>
                </div>
             </div>
           ))) : (
             <div className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center space-y-4">
                <MapPin size={40} className="text-gray-200" />
                <p className="text-sm font-black text-gray-300 uppercase tracking-widest leading-relaxed">Select a driver on the map to view live telemetry.</p>
             </div>
           )}

           <div className="bg-[#006666] text-white p-8 rounded-[3rem] shadow-xl space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-300 flex items-center gap-2"><Info size={14} /> Status Brief</h4>
              <p className="text-sm font-bold leading-relaxed">Fleet status is synchronized with central dispatch every 30 seconds for live node tracking.</p>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default FleetTracker;
