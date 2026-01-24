import React from "react";
import Button from "../ui/Button";
import { CheckoutStep } from "./CheckoutStepper";

type Props = {
  slots: string[];
  selected: string | null;
  onSelect: (s: string) => void;
  onBack: () => void;
  onNext: (step: CheckoutStep) => void;
};

export const ScheduleStep: React.FC<Props> = ({ slots, selected, onSelect, onBack, onNext }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <h2 className="text-4xl font-black italic">Pick a time slot</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {slots.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`p-6 rounded-2xl border-2 font-bold text-sm transition-all ${
            selected === s ? "border-[#008A45] bg-emerald-50 text-[#008A45]" : "border-gray-50 hover:border-gray-200 text-gray-400"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
    <div className="flex gap-4">
      <Button variant="ghost" className="flex-1 h-16" onClick={onBack}>
        Back
      </Button>
      <Button size="lg" className="flex-[2] h-16 rounded-2xl" disabled={!selected} onClick={() => onNext("PAYMENT")}>
        Go to Payment
      </Button>
    </div>
  </div>
);

export default ScheduleStep;
