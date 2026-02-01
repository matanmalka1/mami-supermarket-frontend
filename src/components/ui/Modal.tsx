import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`bg-white rounded-2xl w-full ${sizes[size]} shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h3
              id="modal-title"
              className="text-2xl text-gray-900 tracking-tight"
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-4">{children}</div>

        {footer && (
          <div className="p-6 px-8 bg-gray-50/50 border-t border-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
