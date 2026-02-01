import React from "react";
import { Scale } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface PickingScaleModalProps {
  isOpen: boolean;
  weighingItem: any;
  currentWeight: number | null;
  isSimulated: boolean;
  onClose: () => void;
  setManualWeight: (value: number) => void;
  onConfirm: () => void;
}

const PickingScaleModal: React.FC<PickingScaleModalProps> = ({
  isOpen,
  weighingItem,
  currentWeight,
  isSimulated,
  onClose,
  setManualWeight,
  onConfirm,
}) => {
  const weightValue = currentWeight ?? 0;
  const isConfirmDisabled = weightValue <= 0;

  const handleManualWeightChange = (value: string) => {
    const parsed = parseFloat(value);
    setManualWeight(Number.isNaN(parsed) ? 0 : parsed);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Produce Weight Check">
      <div className="py-10 space-y-8 text-center">
        <div className="relative inline-block">
          <div className="w-56 h-56 rounded-full border-8 transition-all flex flex-col items-center justify-center bg-gray-50 border-emerald-500">
            <Scale size={48} className="text-emerald-500" />
            <span className="text-5xl  tracking-tighter mt-2">
              {weightValue} <span className="text-lg opacity-50">KG</span>
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-xl ">{weighingItem?.product?.name}</h4>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Expected: {(weighingItem?.quantity * 0.5).toFixed(2)} KG (approx)
          </p>
          {isSimulated && (
            <p className="text-[11px] text-amber-600 uppercase tracking-widest">
              Simulated scale • enter weight manually
            </p>
          )}
        </div>
        <input
          type="number"
          step="0.01"
          min="0"
          className="w-full bg-gray-50 border rounded-2xl p-4 text-center"
          value={currentWeight ?? ""}
          onChange={(e) => handleManualWeightChange(e.target.value)}
          placeholder="Enter measured weight (KG)"
        />
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setManualWeight(0)}
          >
            Clear
          </Button>
          <Button
            variant="brand"
            className="flex-1 rounded-2xl"
            disabled={isConfirmDisabled}
            onClick={onConfirm}
          >
            Confirm Weight
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PickingScaleModal;
