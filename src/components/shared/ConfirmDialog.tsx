import React from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

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
  <ConfirmModal
    isOpen={isOpen}
    onCancel={onClose}
    onConfirm={onConfirm}
    title={title}
    description={message}
    confirmLabel={confirmLabel}
    cancelLabel={cancelLabel}
    variant={variant}
    loading={loading}
    size="sm"
  />
);

export default ConfirmDialog;
