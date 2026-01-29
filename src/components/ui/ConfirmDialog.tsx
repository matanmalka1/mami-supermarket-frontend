import ConfirmModal from "./ConfirmModal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "primary",
  loading = false,
}) => (
  <ConfirmModal
    isOpen={isOpen}
    onCancel={onClose}
    onConfirm={onConfirm}
    title={title}
    message={message}
    confirmLabel={confirmLabel}
    variant={variant}
    loading={loading}
  />
);

export default ConfirmDialog;
