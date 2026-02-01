// Added React import to resolve missing namespace errors
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import MissingItemReplacement from "@/components/ops/modals/MissingItemReplacement";

type ItemStatus = "MISSING" | "FOUND" | "REPLACED";
type ReplacementProduct = { id: number; name: string };

interface MissingItemModalProps {
  itemId: string | number | null;
  onClose: () => void;
  onUpdateStatus: (
    itemId: string | number,
    status: ItemStatus,
    reason: string,
    replacement?: ReplacementProduct,
  ) => void;
  itemName?: string;
}

const MISSING_REASONS = [
  "Out of Stock",
  "Damaged / Expired",
  "Incorrect Price",
  "Location Empty",
  "Other",
];

const MissingItemModal: React.FC<MissingItemModalProps> = ({
  itemId,
  onClose,
  onUpdateStatus,
  itemName,
}) => {
  const [modalStep, setModalStep] = useState<"REASON" | "REPLACEMENT">(
    "REASON",
  );
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const renderReasonStep = () => (
    <div className="space-y-2 p-2">
      {MISSING_REASONS.map((r) => (
        <button
          key={r}
          onClick={() => {
            setSelectedReason(r);
            setModalStep("REPLACEMENT");
          }}
          className="w-full text-left p-4 rounded-2xl hover:bg-red-50 hover:text-red-700 transition-all font-bold flex items-center justify-between border border-transparent hover:border-red-100"
        >
          {r} <ChevronDown size={18} className="text-gray-300 -rotate-90" />
        </button>
      ))}
    </div>
  );

  const renderReplacementStep = () => (
    <MissingItemReplacement
      itemName={itemName}
      onSelect={(product) => {
        if (!itemId || !selectedReason) return;
        onUpdateStatus(itemId, "MISSING", selectedReason, {
          id: product.id,
          name: product.name,
        });
      }}
      onBack={() => setModalStep("REASON")}
    />
  );

  return (
    <Modal
      isOpen={!!itemId}
      onClose={onClose}
      title={modalStep === "REASON" ? "Report Shortage" : "Select Alternative"}
      subtitle={
        modalStep === "REASON"
          ? "Log why this item is unavailable"
          : `Finding replacement for ${itemName}`
      }
      footer={
        <div className="flex gap-3 w-full">
          {modalStep === "REPLACEMENT" && (
            <Button
              variant="ghost"
              onClick={() => setModalStep("REASON")}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          {modalStep === "REASON" && selectedReason && (
            <Button
              onClick={() => {
                if (!itemId || !selectedReason) return;
                onUpdateStatus(itemId, "MISSING", selectedReason);
              }}
              className="flex-1"
            >
              Skip Alt
            </Button>
          )}
        </div>
      }
    >
      {modalStep === "REASON" ? renderReasonStep() : renderReplacementStep()}
    </Modal>
  );
};

export default MissingItemModal;
