import React, { useEffect, useState } from "react";
import { MapPin, Info } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import LoadingState from "@/components/shared/LoadingState";
import { apiService } from "@/services/api";

type MapResponse = {
  map?: { branches?: any[]; warehouse?: any };
};

const WarehouseMap: React.FC = () => {
  const [data, setData] = useState<MapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.ops.getWarehouseMap();
        setData(res as MapResponse);
      } catch (err: any) {
        setError(err.message || "Map endpoint unavailable");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const branches = data?.map?.branches || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">Floor Navigator</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
            Live Storefront Map • View disabled until real coordinates are provided
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-6">
        {loading ? (
          <LoadingState label="Requesting warehouse map data..." />
        ) : error ? (
          <EmptyState title="Map unavailable" description={error} />
        ) : branches.length === 0 ? (
          <EmptyState
            title="No geospatial data"
            description="Backend returns placeholder map data. Map rendering is disabled until real coordinates are stored."
          />
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-black uppercase tracking-[0.2em]">
              <Info size={14} /> Map view not implemented yet
            </div>
            <p className="text-sm text-gray-500 font-bold">
              Showing branch list only to avoid simulated pins. Replace with real coordinates and bin layout to enable the map.
            </p>
            <div className="space-y-3">
              {branches.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{b.name || b.id}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {b.lat && b.lng ? `${b.lat}, ${b.lng}` : "Coordinates missing"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WarehouseMap;
