import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="flex items-start gap-4 py-2">
      <div
        className={`p-3 rounded-2xl shrink-0 ${
          variant === "danger"
            ? "bg-red-50 text-red-500"
            : "bg-teal-50 text-[#006666]"
        }`}
      >
        <AlertCircle size={24} />
      </div>
      <p className="text-gray-600 leading-relaxed font-medium">{message}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;
