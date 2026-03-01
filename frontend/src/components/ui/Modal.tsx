import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-[20px] shadow-xl w-full max-w-[940px] mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
};
