import React from "react";
import { Truck, Store, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { CheckoutStep } from "./CheckoutStepper";

export type FulfillmentMethod = "DELIVERY" | "PICKUP";

const FULFILLMENT_OPTIONS: {
  name: FulfillmentMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "DELIVERY",
    title: "Home Delivery",
    description: "Directly to your doorstep",
    icon: <Truck size={40} role="presentation" />,
  },
  {
    name: "PICKUP",
    title: "Store Pickup",
    description: "Pick up from nearest branch",
    icon: <Store size={40} role="presentation" />,
  },
];

type Props = {
  method: FulfillmentMethod | null;
  onSelect: (method: FulfillmentMethod) => void;
  onNext: (step: CheckoutStep) => void;
  error?: string | null;
};

const FulfillmentOption: React.FC<{
  option: (typeof FULFILLMENT_OPTIONS)[number];
  selected: boolean;
  onSelect: (name: FulfillmentMethod) => void;
}> = ({ option, selected, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={() => onSelect(option.name)}
    className={`p-10 rounded-[2.5rem] border-4 transition-all text-left space-y-4 ${
      selected
        ? "border-[#008A45] bg-emerald-50/50"
        : "border-gray-50 hover:border-gray-200"
    }`}
  >
    <div
      className={`${
        selected ? "text-[#008A45]" : "text-gray-300"
      } transition-colors`}
    >
      {option.icon}
    </div>
    <div>
      <h3 className="text-xl ">{option.title}</h3>
      <p className="text-sm text-gray-500 font-bold">{option.description}</p>
    </div>
  </button>
);

export const FulfillmentStep: React.FC<Props> = ({
  method,
  onSelect,
  onNext,
  error,
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <h2 className="text-4xl ">How would you like your groceries?</h2>
    <div role="radiogroup" className="grid grid-cols-2 gap-6">
      {FULFILLMENT_OPTIONS.map((option) => (
        <FulfillmentOption
          key={option.name}
          option={option}
          selected={method === option.name}
          onSelect={onSelect}
        />
      ))}
    </div>
    <ErrorMessage message={error} className="text-sm uppercase tracking-[0.3em]" />
    <Button
      size="lg"
      className="w-full h-20 rounded-[1.5rem]"
      onClick={() => onNext("SCHEDULE")}
      disabled={!method}
    >
      Continue to Schedule <ChevronRight className="ml-2" />
    </Button>
  </div>
);

export default FulfillmentStep;
