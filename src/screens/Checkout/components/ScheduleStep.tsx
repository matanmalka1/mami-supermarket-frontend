import React from "react";
import Button from "../ui/Button";
import { CheckoutStep } from "./CheckoutStepper";
import { DeliverySlotOption } from "@/types/branch";

type Props = {
  slots: DeliverySlotOption[];
  selected: number | null;
  onSelect: (s: number) => void;
  onBack: () => void;
  onNext: (step: CheckoutStep) => void;
};

export const ScheduleStep: React.FC<Props> = ({
  slots,
  selected,
  onSelect,
  onBack,
  onNext,
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <h2 className="text-4xl font-black italic">Pick a time slot</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {slots.length === 0 ? (
        <div className="col-span-full text-center text-gray-400 font-bold uppercase text-xs tracking-[0.3em]">
          Loading delivery slots...
        </div>
      ) : (
        slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelect(slot.id)}
            className={`p-6 rounded-2xl border-2 font-bold text-sm transition-all ${
              selected === slot.id
                ? "border-[#008A45] bg-emerald-50 text-[#008A45]"
                : "border-gray-50 hover:border-gray-200 text-gray-400"
            }`}
          >
            {slot.label}
          </button>
        ))
      )}
    </div>
    <div className="flex gap-4">
      <Button variant="ghost" className="flex-1 h-16" onClick={onBack}>
        Back
      </Button>
      <Button
        size="lg"
        className="flex-[2] h-16 rounded-2xl"
        disabled={!selected}
        onClick={() => onNext("PAYMENT")}
      >
        Go to Payment
      </Button>
    </div>
  </div>
);

export default ScheduleStep;
