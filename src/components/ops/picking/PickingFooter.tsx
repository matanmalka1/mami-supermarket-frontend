
import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle, RotateCcw, Timer } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";

type PickingStatus = "PICKED" | "PENDING" | "MISSING";
type PickingItem = { id: string | number; pickedStatus?: PickingStatus | string };

interface PickingFooterProps {
  items: PickingItem[];
  progress: number;
  onComplete: () => void;
  onSync: () => Promise<void>;
}

const PickingFooter: React.FC<PickingFooterProps> = ({
  items,
  progress,
  onComplete,
  onSync,
}) => {
  const pickedCount = items.filter((item) => item.pickedStatus === "PICKED").length;
  const pendingCount = items.length - pickedCount;
  // Simple estimation logic: 1.5 minutes per pending item
  const estimatedMinutes = Math.max(1, pendingCount * 1.5);
  const [syncing, setSyncing] = useState(false);
  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await onSync();
      toast.success("Picking data synced");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed";
      toast.error(message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 h-28 bg-white/90 backdrop-blur-2xl border-t border-gray-100 flex items-center justify-between px-12 z-50 shadow-[0_-10px_50px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-12">
        {/* Progress Section */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">Batch Progress</span>
          <div className="flex items-baseline gap-2">
             <span className="text-5xl text-[#006666] tracking-tighter tabular-nums leading-none">
              {pickedCount}
             </span>
             <span className="text-xl text-gray-200">/</span>
             <span className="text-2xl text-gray-300 tabular-nums">
              {items.length}
             </span>
             <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-widest">Items Picked</span>
          </div>
        </div>

        <div className="h-12 w-px bg-gray-100"></div>

        {/* Stats Section */}
        <div className="flex gap-10">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">To Collect</span>
            <div className="flex items-center gap-2 text-sm text-orange-600 uppercase">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
              {pendingCount} Remaining
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Time Remaining</span>
            <div className="flex items-center gap-2 text-sm text-gray-600 uppercase">
              <Timer size={16} className="text-gray-400" />
              Est. {Math.floor(estimatedMinutes)}m
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        {/* Sync Action */}
        <button 
          onClick={handleSync}
          className="w-14 h-16 flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 hover:text-[#006666] hover:bg-white hover:border-teal-100 transition-all shadow-sm"
          title="Manual Sync"
          disabled={syncing}
        >
          <RotateCcw size={22} />
        </button>

        {/* Finalize Action */}
        <Button 
          size="lg"
          disabled={progress < 100} 
          onClick={onComplete} 
          className={`rounded-2xl w-80 h-16 transition-all duration-500 text-lg uppercase tracking-widest ${
            progress === 100 
              ? 'bg-[#008A45] hover:bg-[#006b35] scale-105 shadow-[0_20px_40px_rgba(0,138,69,0.2)]' 
              : 'bg-gray-100 text-gray-300 border-transparent shadow-none cursor-not-allowed opacity-60'
          }`}
        >
          {progress === 100 ? (
            <span className="flex items-center gap-3 animate-in slide-in-from-bottom-2">
              Finalize Order <CheckCircle2 size={24} />
            </span>
          ) : (
            <span className="flex items-center gap-3">
              Items Pending <XCircle size={24} />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PickingFooter;
