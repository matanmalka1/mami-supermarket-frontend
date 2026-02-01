import { CheckCircle2 } from "lucide-react";

export type CheckoutStep = "FULFILLMENT" | "SCHEDULE" | "PAYMENT";

const DEFAULT_STEPS: CheckoutStep[] = ["FULFILLMENT", "SCHEDULE", "PAYMENT"];
const STEP_LABELS: Record<CheckoutStep, string> = {
  FULFILLMENT: "Fulfillment",
  SCHEDULE: "Schedule",
  PAYMENT: "Payment",
};

type Props = {
  step: CheckoutStep;
  steps?: CheckoutStep[];
};

export const CheckoutStepper: React.FC<Props> = ({ step, steps = DEFAULT_STEPS }) => {
  const currentIndex = steps.indexOf(step);

  const getState = (index: number, value: CheckoutStep) => {
    const isActive = value === step;
    const isCompleted = index < currentIndex;
    return { isActive, isCompleted };
  };

  const circleClass = (state: ReturnType<typeof getState>) => {
    if (state.isActive) {
      return "border-[#008A45] bg-[#008A45] text-white scale-110 shadow-lg";
    }
    if (state.isCompleted) {
      return "border-[#008A45] bg-white text-[#008A45]";
    }
    return "border-gray-100 bg-white text-gray-300";
  };

  const labelClass = (state: ReturnType<typeof getState>) =>
    state.isActive ? "text-[#008A45]" : "text-gray-300";

  return (
    <div className="flex justify-between items-center relative" role="list" aria-label="Checkout progress">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10" aria-hidden />
      {steps.map((value, index) => {
        const state = getState(index, value);
        return (
          <div key={value} className="bg-white px-4 flex flex-col items-center gap-2" role="listitem">
            <div
              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${circleClass(state)}`}
              aria-current={state.isActive ? "step" : undefined}
              aria-label={`${STEP_LABELS[value]} ${state.isCompleted ? "completed" : state.isActive ? "current" : "upcoming"}`}
            >
              {state.isCompleted ? <CheckCircle2 size={24} aria-hidden /> : index + 1}
            </div>
            <span className={`text-[10px] uppercase tracking-widest ${labelClass(state)}`}>
              {STEP_LABELS[value]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;
