import React from "react";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import ProgressTimeline, {
  type TimelineStep,
} from "@/components/ui/ProgressTimeline";

const steps: TimelineStep[] = [
  { id: "confirmed", label: "Confirmed", icon: <Package size={20} />, done: true },
  { id: "picking", label: "Picking", icon: <CheckCircle2 size={20} /> },
  { id: "en-route", label: "En Route", icon: <Truck size={20} /> },
  { id: "delivered", label: "Delivered", icon: <Home size={20} /> },
];

const OrderProgressTimeline: React.FC = () => (
  <div className="bg-white border rounded-[3rem] p-12 shadow-xl space-y-10">
    <ProgressTimeline
      steps={steps}
      progress={25}
      activeStepId="confirmed"
      className="flex justify-between items-center"
    />
  </div>
);

export default OrderProgressTimeline;
