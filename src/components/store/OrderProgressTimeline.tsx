import React, { useMemo } from "react";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressTimeline, {
  type TimelineStep,
} from "@/components/ui/ProgressTimeline";
import { OrderStatus } from "@/domains/orders/types";

interface OrderProgressTimelineProps {
  currentStatus: OrderStatus;
}

const getStepProgress = (
  status: OrderStatus,
): { activeStepId: string; progress: number; steps: TimelineStep[] } => {
  const baseSteps: TimelineStep[] = [
    { id: "confirmed", label: "Confirmed", icon: <Package size={20} /> },
    { id: "picking", label: "Picking", icon: <CheckCircle2 size={20} /> },
    { id: "en-route", label: "On Route", icon: <Truck size={20} /> },
    { id: "delivered", label: "Delivered", icon: <Home size={20} /> },
  ];

  switch (status) {
    case OrderStatus.CREATED:
      return {
        activeStepId: "confirmed",
        progress: 25,
        steps: baseSteps.map((step, idx) => ({
          ...step,
          done: idx === 0,
        })),
      };
    case OrderStatus.IN_PROGRESS:
      return {
        activeStepId: "picking",
        progress: 50,
        steps: baseSteps.map((step, idx) => ({
          ...step,
          done: idx <= 1,
        })),
      };
    case OrderStatus.READY:
    case OrderStatus.OUT_FOR_DELIVERY:
      return {
        activeStepId: "en-route",
        progress: 75,
        steps: baseSteps.map((step, idx) => ({
          ...step,
          done: idx <= 2,
        })),
      };
    case OrderStatus.DELIVERED:
      return {
        activeStepId: "delivered",
        progress: 100,
        steps: baseSteps.map((step) => ({
          ...step,
          done: true,
        })),
      };
    case OrderStatus.CANCELED:
    case OrderStatus.DELAYED:
    case OrderStatus.MISSING:
      return {
        activeStepId: "confirmed",
        progress: 25,
        steps: baseSteps.map((step, idx) => ({
          ...step,
          done: idx === 0,
        })),
      };
    default:
      return {
        activeStepId: "confirmed",
        progress: 25,
        steps: baseSteps.map((step, idx) => ({
          ...step,
          done: idx === 0,
        })),
      };
  }
};

const OrderProgressTimeline: React.FC<OrderProgressTimelineProps> = ({
  currentStatus,
}) => {
  const { steps, progress, activeStepId } = useMemo(
    () => getStepProgress(currentStatus),
    [currentStatus],
  );

  return (
    <Card variant="glass" padding="lg">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">
          Order Progress
        </h3>
      </div>
      <ProgressTimeline
        steps={steps}
        progress={progress}
        activeStepId={activeStepId}
        className="py-4"
      />
    </Card>
  );
};

export default OrderProgressTimeline;
