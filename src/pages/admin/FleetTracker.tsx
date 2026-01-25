import React, { useEffect, useMemo, useState } from "react";
import { Truck, Activity, ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/api";

type FleetDriver = {
  id: string;
  name: string;
  status: string;
  items: number;
  eta?: string;
};

const FleetTracker: React.FC = () => {
  const [drivers, setDrivers] = useState<FleetDriver[]>([]);

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

  const driversWithCoords = useMemo(
    () => drivers.filter((d: any) => typeof (d as any).lat === "number" && typeof (d as any).lng === "number"),
    [drivers],
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Link to="/logistics" className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest mb-4 group">
            <ArrowLeft size={14} /> Back to Command
          </Link>
          <h1 className="text-5xl font-black italic tracking-tighter">Fleet Live</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Real-time Tel Aviv Fleet Monitoring</p>
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
        <div className="col-span-12 lg:col-span-9 border-8 border-white rounded-[4rem] shadow-2xl min-h-[420px] bg-gray-50 flex items-center justify-center relative">
          {driversWithCoords.length === 0 ? (
            <div className="text-center space-y-3 px-10 py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-black uppercase tracking-[0.2em]">
                <Info size={14} /> Map requires coordinates
              </div>
              <p className="text-sm font-bold text-gray-500 max-w-xl">
                Fleet status is available, but coordinate data is missing. The map view is disabled to avoid simulated pins. Showing list view only.
              </p>
              <Button variant="ghost" onClick={() => toast("Waiting for live GPS data...", { icon: "🛰️" })}>
                Refresh when GPS available
              </Button>
            </div>
          ) : (
            <div className="w-full h-full p-8">
              <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live GPS Pins</p>
                {driversWithCoords.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Truck size={18} className="text-emerald-500" />
                      <div>
                        <p className="font-black">{d.name}</p>
                        <p className="text-xs text-gray-400 font-bold">
                          {d.lat}, {d.lng} {d.status ? `• ${d.status}` : ""}
                        </p>
                      </div>
                    </div>
                    <Badge color="gray">{d.status || "Active"}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                className="p-4 bg-white border rounded-2xl flex items-center justify-between"
              >
                <div>
                  <p className="font-black italic">{d.name}</p>
                  <p className="text-xs text-gray-400 font-bold">
                    {d.status} • {d.items} items {d.eta ? `• ETA ${d.eta}` : ""}
                  </p>
                </div>
                <Badge color="gray">{d.status}</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetTracker;
