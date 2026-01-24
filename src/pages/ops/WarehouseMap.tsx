import React, { useState } from 'react';
import { MapPin, Navigation, Info, Search, Move, Layers, LocateFixed, Package } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const WarehouseMap: React.FC = () => {
  const [activeAisle, setActiveAisle] = useState<string | null>('A1');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'blueprint'>('grid');

  const handleLocateMe = () => {
    toast.success("GPS Lock: Current position tagged in Zone Alpha", { icon: '🎯' });
  };

  const toggleLayer = () => {
    setViewMode(viewMode === 'grid' ? 'blueprint' : 'grid');
    toast(`Switched to ${viewMode === 'grid' ? 'Technical Blueprint' : 'Operational Grid'} view`, { icon: '🗺️' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toUpperCase().startsWith('A') || searchQuery.toUpperCase().startsWith('B') || searchQuery.toUpperCase().startsWith('C')) {
      const aisle = searchQuery.toUpperCase().slice(0, 2);
      setActiveAisle(aisle);
      toast.success(`Locating bin in Aisle ${aisle}...`);
    } else {
      toast.error("Enter a valid bin location (e.g., A1, B2)");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">Floor Navigator</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Live Storefront Cluster • Zone Alpha</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-64">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
           <input 
              placeholder="Locate SKU/Bin..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:border-[#006666] transition-all" 
           />
        </form>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className={`col-span-12 lg:col-span-8 border-8 border-white rounded-[3.5rem] shadow-2xl p-12 relative min-h-[600px] overflow-hidden transition-colors duration-700 ${viewMode === 'grid' ? 'bg-gray-50' : 'bg-[#0a192f]'}`}>
          {/* Mock SVG Map */}
          <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-2xl">
            {/* Aisles */}
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((id, idx) => (
              <g key={id} onClick={() => setActiveAisle(id)} className="cursor-pointer group">
                <rect 
                  x={100 + (idx % 2 === 0 ? 0 : 400)} 
                  y={50 + (Math.floor(idx / 2) * 150)} 
                  width="200" height="100" 
                  rx="20" 
                  className={`transition-all duration-500 stroke-2 ${
                    activeAisle === id 
                      ? (viewMode === 'grid' ? 'fill-teal-500/10 stroke-teal-500' : 'fill-teal-400/20 stroke-teal-300') 
                      : (viewMode === 'grid' ? 'fill-white stroke-gray-100 hover:stroke-gray-300' : 'fill-transparent stroke-gray-700 hover:stroke-teal-900')
                  }`} 
                />
                <text x={200 + (idx % 2 === 0 ? 0 : 400)} y={105 + (Math.floor(idx / 2) * 150)} textAnchor="middle" className={`text-xl font-black italic ${activeAisle === id ? (viewMode === 'grid' ? 'fill-teal-700' : 'fill-teal-300') : (viewMode === 'grid' ? 'fill-gray-300' : 'fill-gray-700')}`}>{id}</text>
              </g>
            ))}
            {/* Connection Paths */}
            <path d="M 200 150 L 200 200 L 600 200 L 600 150" fill="none" stroke={viewMode === 'grid' ? "#E2E8F0" : "#1e293b"} strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
            
            {/* User Indicator */}
            <g className="animate-bounce">
              <circle cx={200} cy={100} r={12} fill="#006666" stroke="white" strokeWidth="3" />
              <circle cx={200} cy={100} r={24} className="fill-[#006666] opacity-20" />
            </g>

            {/* Target Bin */}
            <g>
              <rect x="580" y="380" width="40" height="40" rx="10" fill="#F97316" className="animate-pulse" />
              <text x="600" y="405" textAnchor="middle" className="fill-white text-[10px] font-black">C2</text>
            </g>
          </svg>

          {/* Map Floating Controls */}
          <div className="absolute top-8 left-8 flex flex-col gap-4">
             <button 
               onClick={toggleLayer}
               className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all ${viewMode === 'grid' ? 'bg-white text-gray-400 hover:text-emerald-600' : 'bg-emerald-600 text-white'}`}
             >
                <Layers size={24} />
             </button>
             <button 
               onClick={handleLocateMe}
               className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-xl transition-all"
             >
                <LocateFixed size={24} />
             </button>
          </div>

          <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur rounded-[2rem] p-6 border border-white shadow-xl flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white"><Navigation size={24} /></div>
                <div>
                  <h4 className="font-black italic">Next Stop: Aisle C2</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bin 12-4 • Dairy Cluster</p>
                </div>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
              <h3 className="text-xl font-black italic flex items-center gap-3"><Info size={20} className="text-[#006666]" /> Aisle Breakdown</h3>
              <div className="space-y-4">
                 {[
                   { label: 'A1 - Fresh Produce', load: '85%', color: 'emerald' },
                   { label: 'A2 - Organic Pantry', load: '42%', color: 'orange' },
                   { label: 'B1 - Meat & Poultry', load: '10%', color: 'red' },
                   { label: 'B2 - Bakery Fresh', load: '60%', color: 'blue' },
                 ].map(item => (
                   <div key={item.label} className="space-y-2">
                     <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-gray-900">{item.label}</span>
                       <span className="text-gray-400">{item.load} density</span>
                     </div>
                     <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                       <div className={`h-full bg-${item.color}-500 transition-all duration-1000`} style={{ width: item.load }} />
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#006666] text-white p-8 rounded-[2.5rem] shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-teal-300 font-black uppercase text-[10px] tracking-widest">
                <Move size={14} /> Pathing Active
              </div>
              <p className="text-sm font-bold leading-relaxed italic">Path is automatically sequenced based on standard warehouse layout for faster fulfillment.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseMap;