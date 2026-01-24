import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  Search,
  Camera,
  AlertTriangle,
  CheckCircle2,
  History,
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { toast } from "react-hot-toast";
import { sleep } from "../utils/async";
import { apiService } from "../services/api";
import { stockRequestSchema, StockRequestInput } from "../validation/ops";

const StockRequests: React.FC = () => {
  const [step, setStep] = useState<"FORM" | "HISTORY">("FORM");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<StockRequestInput>({
    resolver: zodResolver(stockRequestSchema),
    defaultValues: { product: "", quantity: 0, priority: "Normal" },
  });

  const onSubmit = async (data: StockRequestInput) => {
    toast.loading("Broadcasting request to logistics cluster...");
    try {
      await apiService.ops.createStockRequest({
        productName: data.product,
        quantity: data.quantity,
        priority: data.priority.toUpperCase() as any,
      });
      await sleep(800);
      toast.dismiss();
      toast.success("Shortage reported. Manager node notified.");
      setAttachedFile(null);
      reset();
    } catch {
      toast.error("Cluster sync failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      toast.success(`Attached: ${file.name}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">
            Stock Reports
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
            Inventory Sync • Reporting Node
          </p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setStep("FORM")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${step === "FORM" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}
          >
            New Request
          </button>
          <button
            onClick={() => setStep("HISTORY")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${step === "HISTORY" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"}`}
          >
            My History
          </button>
        </div>
      </div>

      {step === "FORM" ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-sm space-y-10"
        >
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Search Product
              </label>
              <div className="relative">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  {...register("product")}
                  placeholder="Enter SKU or Name"
                  className={`w-full bg-gray-50 border ${errors.product ? "border-red-500" : "border-gray-100"} rounded-2xl py-5 pl-16 pr-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold`}
                />
              </div>
              {errors.product && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.product.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Quantity Needed
              </label>
              <input
                type="number"
                {...register("quantity")}
                placeholder="0"
                className={`w-full bg-gray-50 border ${errors.quantity ? "border-red-500" : "border-gray-100"} rounded-2xl py-5 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-black text-2xl italic text-[#006666]`}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["Normal", "Urgent", "Critical"].map((lvl) => (
                <label key={lvl} className="relative cursor-pointer group">
                  <input
                    type="radio"
                    {...register("priority")}
                    value={lvl}
                    className="peer hidden"
                  />
                  <div className="p-6 bg-gray-50 border-2 border-gray-50 rounded-[1.5rem] text-center font-black italic transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50/50 peer-checked:text-emerald-700 group-hover:border-gray-200">
                    {lvl === "Critical" && (
                      <AlertTriangle
                        size={16}
                        className="mx-auto mb-2 text-red-500"
                      />
                    )}
                    {lvl}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`p-10 border-4 border-dashed rounded-[2rem] text-center space-y-4 transition-all cursor-pointer group ${attachedFile ? "border-emerald-500 bg-emerald-50/20" : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"}`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform ${attachedFile ? "bg-emerald-500 text-white" : "bg-gray-50 text-gray-300"}`}
            >
              {attachedFile ? <CheckCircle2 size={32} /> : <Camera size={32} />}
            </div>
            <p
              className={`text-sm font-bold ${attachedFile ? "text-emerald-700" : "text-gray-400"}`}
            >
              {attachedFile
                ? `Attached: ${attachedFile.name}`
                : "Attach a photo of the empty shelf (Optional)"}
            </p>
          </div>

          <Button
            fullWidth
            size="lg"
            className="rounded-[1.5rem] h-20 text-xl italic"
            loading={isSubmitting}
          >
            Submit Stock Request
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all"
            >
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-black text-xl italic">Organic Milk 2L</h4>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Requested 2 hours ago • SKU: 9422
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-lg font-black italic">42 Units</p>
                  <Badge color={i === 1 ? "emerald" : "orange"}>
                    {i === 1 ? "Delivered" : "In Transit"}
                  </Badge>
                </div>
                {i === 1 ? (
                  <CheckCircle2 className="text-emerald-500" />
                ) : (
                  <History className="text-orange-400 animate-spin-slow" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockRequests;
