import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertCircle } from "lucide-react";

export type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description?: React.ReactNode;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
  size = "sm",
  children,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    size={size}
    footer={
      <>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
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
      <div className="space-y-3 text-gray-600 leading-relaxed font-medium">
        {description ?? message}
      </div>
    </div>
    {children}
  </Modal>
);

export default ConfirmModal;
