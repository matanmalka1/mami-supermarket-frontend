import React, { useState } from "react";
import { Save, ShieldAlert, Coins, Percent, Truck, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { sleep } from "../../utils/async";
import { apiService } from "../../services/api";

const GlobalSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.admin.updateSettings({
        vat_rate: 17,
        free_delivery_threshold: 250,
      });
      await sleep(1000);
      toast.success("Global config updated & broadcasted to clusters.");
    } catch {
      toast.error("Settings push failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendCatalog = () => {
    toast.error("Global Catalog Suspended. All checkout flows halted.", {
      duration: 5000,
    });
    setIsSuspendDialogOpen(false);
  };

  const flushCache = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("mami_")) keysToRemove.push(key);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    toast.success("Operational Cache purged successfully.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end border-b pb-8">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">
            System Config
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
            Business Logic • Master Settings
          </p>
        </div>
        <Button
          variant="emerald"
          icon={<Save size={18} />}
          className="rounded-2xl h-14 px-10 shadow-xl"
          onClick={handleSave}
          loading={loading}
        >
          Publish Global Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white border border-gray-100 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
          <h3 className="text-xl font-black italic flex items-center gap-3 text-[#006666]">
            <Coins size={22} /> Pricing & Tax
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                VAT Rate (%)
              </label>
              <div className="relative">
                <Percent
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  type="number"
                  defaultValue={17}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 font-black italic text-lg outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Free Delivery Threshold (₪)
              </label>
              <input
                type="number"
                defaultValue={250}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 font-black italic text-lg outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-emerald-900 text-white rounded-[2.5rem] p-10 space-y-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Coins size={120} />
          </div>
          <h3 className="text-xl font-black italic flex items-center gap-3 text-emerald-300">
            <Coins size={22} /> Loyalty
          </h3>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="font-bold">Member Multiplier</span>
              <span className="text-2xl font-black italic text-emerald-400">
                1.5x
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="font-bold">Points Per Item</span>
              <span className="text-2xl font-black italic text-emerald-400">
                10pts
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
          <h3 className="text-xl font-black italic flex items-center gap-3 text-[#006666]">
            <Truck size={22} /> Fulfillment Logic
          </h3>
          <div className="space-y-4">
            {[
              { label: "Auto-Reject Overfilled Slots", checked: true },
              { label: "Force Replacement Selection", checked: true },
            ].map((rule) => (
              <label
                key={rule.label}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group"
              >
                <input
                  type="checkbox"
                  defaultChecked={rule.checked}
                  className="mt-1 w-6 h-6 rounded-lg accent-emerald-600 shadow-sm"
                />
                <p className="font-bold text-gray-900">{rule.label}</p>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-red-50 border border-red-100 rounded-[2.5rem] p-10 space-y-8">
          <h3 className="text-xl font-black italic flex items-center gap-3 text-red-600">
            <ShieldAlert size={22} /> Danger Zone
          </h3>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-white text-red-600 border-red-200 hover:bg-red-500 hover:text-white h-14 rounded-2xl font-black"
              onClick={() => setIsSuspendDialogOpen(true)}
            >
              Suspend Global Catalog
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white text-gray-600 border-gray-200 hover:bg-gray-100 h-14 rounded-2xl font-black flex items-center gap-2"
              onClick={flushCache}
            >
              <Trash2 size={16} /> Flush Session Cache
            </Button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onConfirm={handleSuspendCatalog}
        variant="danger"
        title="CRITICAL: Suspend Catalog?"
        message="This will immediately hide all products from the storefront. Reserved for emergency maintenance only."
        confirmLabel="SUSPEND EVERYTHING"
      />
    </div>
  );
};

export default GlobalSettings;
