import { CheckCircle2 } from "lucide-react";

export type CheckoutStep = "FULFILLMENT" | "SCHEDULE" | "PAYMENT";

const steps: CheckoutStep[] = ["FULFILLMENT", "SCHEDULE", "PAYMENT"];

export const CheckoutStepper: React.FC<{ step: CheckoutStep }> = ({ step }) => {
  const currentIndex = steps.indexOf(step);
  return (
    <div className="flex justify-between items-center relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10" />
      {steps.map((s, i) => (
        <div key={s} className="bg-white px-4 flex flex-col items-center gap-2">
          <div
            className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
              step === s
                ? "border-[#008A45] bg-[#008A45] text-white scale-110 shadow-lg"
                : i < currentIndex
                  ? "border-[#008A45] bg-white text-[#008A45]"
                  : "border-gray-100 bg-white text-gray-300"
            }`}
          >
            {i < currentIndex ? <CheckCircle2 size={24} /> : i + 1}
          </div>
          <span
            className={`text-[10px] uppercase tracking-widest ${
              step === s ? "text-[#008A45]" : "text-gray-300"
            }`}
          >
            {s}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CheckoutStepper;
