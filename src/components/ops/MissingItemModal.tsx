// Added React import to resolve missing namespace errors
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import MissingItemReplacement from "@/components/ops/MissingItemReplacement";

interface MissingItemModalProps {
  itemId: string | null;
  onClose: () => void;
  onUpdateStatus: (
    itemId: string,
    status: string,
    reason: string,
    replacement?: any,
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
        onUpdateStatus(itemId!, "MISSING", selectedReason!, product);
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
              onClick={() =>
                onUpdateStatus(itemId!, "MISSING", selectedReason!)
              }
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
