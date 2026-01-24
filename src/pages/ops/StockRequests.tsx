import React, { useState } from "react";
import Button from "@/components/ui/Button";
import StockRequestForm from "@/features/ops/StockRequestForm";
import StockRequestHistory from "@/features/ops/StockRequestHistory";

type Step = "FORM" | "HISTORY";

const StockRequests: React.FC = () => {
  const [step, setStep] = useState<Step>("FORM");

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
        <StockRequestForm onSubmitted={() => setStep("HISTORY")} />
      ) : (
        <div className="space-y-6">
          <StockRequestHistory />
          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={() => setStep("FORM")}
          >
            Submit another request
          </Button>
        </div>
      )}
    </div>
  );
};

export default StockRequests;
