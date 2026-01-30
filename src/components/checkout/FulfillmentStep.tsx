import { Truck, Store, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import { CheckoutStep } from "./CheckoutStepper";

type Props = {
  method: "DELIVERY" | "PICKUP";
  onSelect: (m: "DELIVERY" | "PICKUP") => void;
  onNext: (step: CheckoutStep) => void;
};

export const FulfillmentStep: React.FC<Props> = ({ method, onSelect, onNext }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <h2 className="text-4xl ">How would you like your groceries?</h2>
    <div className="grid grid-cols-2 gap-6">
      <button
        onClick={() => onSelect("DELIVERY")}
        className={`p-10 rounded-[2.5rem] border-4 transition-all text-left space-y-4 ${
          method === "DELIVERY" ? "border-[#008A45] bg-emerald-50/50" : "border-gray-50 hover:border-gray-200"
        }`}
      >
        <Truck size={40} className={method === "DELIVERY" ? "text-[#008A45]" : "text-gray-300"} />
        <div>
          <h3 className="text-xl ">Home Delivery</h3>
          <p className="text-sm text-gray-500 font-bold">Directly to your doorstep</p>
        </div>
      </button>
      <button
        onClick={() => onSelect("PICKUP")}
        className={`p-10 rounded-[2.5rem] border-4 transition-all text-left space-y-4 ${
          method === "PICKUP" ? "border-[#008A45] bg-emerald-50/50" : "border-gray-50 hover:border-gray-200"
        }`}
      >
        <Store size={40} className={method === "PICKUP" ? "text-[#008A45]" : "text-gray-300"} />
        <div>
          <h3 className="text-xl ">Store Pickup</h3>
          <p className="text-sm text-gray-500 font-bold">Pick up from nearest branch</p>
        </div>
      </button>
    </div>
    <Button size="lg" className="w-full h-20 rounded-[1.5rem]" onClick={() => onNext("SCHEDULE")}>
      Continue to Schedule <ChevronRight className="ml-2" />
    </Button>
  </div>
);

export default FulfillmentStep;
