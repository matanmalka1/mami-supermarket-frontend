import React, { useEffect, useState } from "react";
import { MapPin, Info } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import LoadingState from "@/components/shared/LoadingState";
import { apiService } from "@/services/api";

type MapBranch = {
  id: string;
  name?: string;
  lat?: number;
  lng?: number;
};

type MapResponse = {
  map?: { branches?: MapBranch[]; warehouse?: any };
};

const FALLBACK_BRANCHES: MapBranch[] = [
  { id: "branch-guest-1", name: "Main Branch (offline)", lat: 32.1, lng: 34.8 },
  { id: "branch-guest-2", name: "North Branch (offline)", lat: 32.2, lng: 34.9 },
];

const FALLBACK_MAP: MapResponse = { map: { branches: FALLBACK_BRANCHES } };

const WarehouseMap: React.FC = () => {
  const [data, setData] = useState<MapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setUsedFallback(false);
      try {
        const res = await apiService.ops.getWarehouseMap();
        setData(res as MapResponse);
        setUsedFallback(false);
      } catch (err: any) {
        const fallbackMessage = err?.message || "Map endpoint unavailable";
        setError(fallbackMessage);
        setData(FALLBACK_MAP);
        setUsedFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const branches: MapBranch[] = data?.map?.branches || [];

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
        ) : branches.length === 0 ? (
          <EmptyState
            title="No geospatial data"
            description={
              error ||
              "Backend returns placeholder map data. Map rendering is disabled until real coordinates are stored."
            }
          />
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-black uppercase tracking-[0.2em]">
              <Info size={14} /> Map view not implemented yet
            </div>
            <p className="text-sm text-gray-500 font-bold">
              Showing branch list only to avoid simulated pins. Replace with real coordinates and bin layout to enable the map.
            </p>
            {usedFallback && (
              <div className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Live map unavailable ({error || "unknown error"}). Displaying fallback branch list.
              </div>
            )}
            <div className="space-y-3">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                >
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
