import React, { useEffect, useState } from "react";
import { MapPin, Truck, Navigation, Activity, Layers, ArrowLeft, Info } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/api";

type FleetDriver = {
  id: string;
  name: string;
  status: string;
  items: number;
  eta?: string;
};

const FleetTracker: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<FleetDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"standard" | "satellite">("standard");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.admin.getFleetStatus();
        const rows = Array.isArray(data?.drivers) ? data.drivers : Array.isArray(data) ? data : [];
        setDrivers(rows);
      } catch (err: any) {
        toast.error(err.message || "Failed to load fleet status");
      }
    };
    load();
  }, []);

  const toggleLayer = () => {
    setViewMode(viewMode === "standard" ? "satellite" : "standard");
    toast(`Switched to ${viewMode === "standard" ? "Satellite" : "Standard"} map view`, { icon: "🛰️" });
  };

  const centerMap = () => {
    toast.success("Recentering map on Central Hub Cluster", { icon: "🎯" });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Link to="/logistics" className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest mb-4 group">
            <ArrowLeft size={14} /> Back to Command
          </Link>
          <h1 className="text-5xl font-black italic tracking-tighter">Fleet Live</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Real-time Tel Aviv Cluster Monitoring</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl flex items-center gap-3 border border-emerald-100">
            <Activity size={20} className="animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Fleet Pulse</span>
              <span className="font-black text-xl italic">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className={`col-span-12 lg:col-span-9 border-8 border-white rounded-[4rem] shadow-2xl relative min-h-[700px] overflow-hidden transition-colors duration-500 ${viewMode === "satellite" ? "bg-emerald-950" : "bg-gray-50"}`}>
          <svg viewBox="0 0 800 600" className={`w-full h-full transition-opacity ${viewMode === "satellite" ? "opacity-30" : "opacity-60"}`}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className={viewMode === "satellite" ? "text-emerald-800" : "text-gray-200"} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M 0 300 Q 400 250 800 300" fill="none" stroke={viewMode === "satellite" ? "#064e3b" : "#E2E8F0"} strokeWidth="20" strokeLinecap="round" />
            <path d="M 400 0 L 400 600" fill="none" stroke={viewMode === "satellite" ? "#064e3b" : "#E2E8F0"} strokeWidth="15" strokeLinecap="round" />
            {drivers.map((d) => (
              <g key={d.id} onClick={() => setSelectedDriver(d.id)} className="cursor-pointer transition-all duration-1000">
                <circle cx={200 + Math.random() * 400} cy={150 + Math.random() * 300} r="16" className={`${selectedDriver === d.id ? "fill-emerald-500 scale-125" : "fill-white"} stroke-emerald-500 stroke-4 transition-all`} />
                <Truck x={(200 + Math.random() * 400) - 8} y={(150 + Math.random() * 300) - 8} size={16} className={`${selectedDriver === d.id ? "text-white" : "text-emerald-500"}`} />
                <text x={200 + Math.random() * 400} y={(150 + Math.random() * 300) + 35} textAnchor="middle" className={`${viewMode === "satellite" ? "fill-emerald-200" : "fill-gray-400"} text-[10px] font-black uppercase tracking-widest`}>{d.name}</text>
              </g>
            ))}
          </svg>
          <div className="absolute top-8 left-8 flex flex-col gap-3">
            <button
              onClick={toggleLayer}
              className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all border shadow-sm ${viewMode === "satellite" ? "bg-emerald-600 text-white border-emerald-500" : "bg-white text-gray-400 hover:text-emerald-600 border-gray-100"}`}
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
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-4">
          {drivers.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border text-gray-400 font-bold text-center">
              No fleet data.
            </div>
          ) : (
            drivers.map((d) => (
              <div
                key={d.id}
                className={`p-4 bg-white border rounded-2xl flex items-center justify-between ${selectedDriver === d.id ? "border-emerald-300" : ""}`}
              >
                <div>
                  <p className="font-black italic">{d.name}</p>
                  <p className="text-xs text-gray-400 font-bold">
                    {d.status} • {d.items} items {d.eta ? `• ETA ${d.eta}` : ""}
                  </p>
                </div>
                <Badge status={d.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetTracker;
