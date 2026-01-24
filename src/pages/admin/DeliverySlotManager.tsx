import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Clock, ShieldAlert, Save, ChevronRight, Lock, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/api";

const DeliverySlotManager: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBlackoutModalOpen, setIsBlackoutModalOpen] = useState(false);
  const [blackouts, setBlackouts] = useState<{ date: string; reason: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data: any = await apiService.admin.getDeliverySlots();
        const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setSlots(rows);
      } catch (err: any) {
        setError(err.message || "Failed to load delivery slots");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = () => {
    toast("Endpoint not implemented for updates", { icon: "⚠️" });
  };

  const addBlackout = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    setBlackouts([
      ...blackouts,
      { date: formData.get("date") as string, reason: formData.get("reason") as string },
    ]);
    toast.success("Blackout recorded locally (no API)");
  };

  const removeBlackout = (index: number) => {
    setBlackouts(blackouts.filter((_, i) => i !== index));
    toast.success("Blackout removed locally");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Fulfillment Config</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
            Branch Delivery Slots
          </p>
        </div>
        <Button
          variant="emerald"
          icon={<Save size={18} />}
          className="rounded-2xl h-14 px-10 shadow-xl shadow-emerald-900/10"
          onClick={handleSave}
        >
          Publish Changes
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm divide-y">
            {loading ? (
              <div className="p-8 text-center text-gray-400 font-bold">Loading slots...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500 font-bold">{error}</div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-bold">No delivery slots available.</div>
            ) : (
              slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border-2 ${
                        slot.is_active === false || slot.status === "LOCKED"
                          ? "bg-red-50 text-red-500 border-red-100"
                          : "bg-gray-50 text-[#006666] border-gray-100"
                      }`}
                    >
                      {slot.is_active === false || slot.status === "LOCKED" ? <Lock size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black italic text-gray-900">
                        {slot.start_time} - {slot.end_time}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge color={slot.is_active === false ? "red" : "emerald"}>
                          {slot.is_active === false ? "INACTIVE" : "ACTIVE"}
                        </Badge>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Branch: {slot.branch_id || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="space-y-1 text-right">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        Day of Week
                      </label>
                      <div className="font-bold text-gray-700">{slot.day_of_week}</div>
                    </div>
                    <button className="text-gray-300 hover:text-[#006666] p-2">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isBlackoutModalOpen}
        onClose={() => setIsBlackoutModalOpen(false)}
        title="Logistics Blackout"
        subtitle="Disable fulfillment for specific dates"
      >
        <div className="space-y-8 p-2">
          <form onSubmit={addBlackout} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Date</label>
              <input
                name="date"
                type="date"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Reason</label>
              <div className="flex gap-2">
                <input
                  name="reason"
                  placeholder="Event Name"
                  required
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none font-bold"
                />
                <Button type="submit" className="rounded-xl">
                  <Plus size={18} />
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-2">
            {blackouts.map((b, idx) => (
              <div
                key={`${b.date}-${idx}`}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold"
              >
                <span>{b.date}</span>
                <span className="text-gray-500">{b.reason}</span>
                <button
                  onClick={() => removeBlackout(idx)}
                  className="text-red-500 hover:text-red-700 text-xs uppercase font-black"
                >
                  Remove
                </button>
              </div>
            ))}
            {blackouts.length === 0 && (
              <div className="text-center text-gray-400 font-bold">No blackouts recorded.</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeliverySlotManager;
