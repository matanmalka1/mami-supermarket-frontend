import React from "react";
import Button from "@/components/ui/Button";
import { Save } from "lucide-react";

interface DeliverySlotManagerHeaderProps {
  onSave: () => void;
}

const DeliverySlotManagerHeader: React.FC<DeliverySlotManagerHeaderProps> = ({
  onSave,
}) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h1 className="text-4xl  tracking-tight">Fulfillment Config</h1>
      <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
        Branch Delivery Slots
      </p>
    </div>
    <Button
      variant="brand"
      icon={<Save size={18} />}
      className="rounded-2xl h-14 px-10 shadow-xl shadow-emerald-900/10"
      onClick={onSave}
    >
      Publish Changes
    </Button>
  </div>
);

export default DeliverySlotManagerHeader;
