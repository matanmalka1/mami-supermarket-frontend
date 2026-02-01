import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface DamageReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, notes?: string) => Promise<void>;
  itemName?: string;
}

const DamageReportModal: React.FC<DamageReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  itemName,
}) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(reason, notes || undefined);
      setReason("");
      setNotes("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setNotes("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Report Damage">
      <form onSubmit={handleSubmit} className="space-y-4">
        {itemName && (
          <p className="text-sm text-gray-600">
            Reporting damage for: <strong>{itemName}</strong>
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Broken packaging, Expired, Crushed"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional details about the damage..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Report Damage"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DamageReportModal;
