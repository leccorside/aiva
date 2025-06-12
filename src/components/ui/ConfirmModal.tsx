"use client";

import { ReactNode } from "react";
import { Button } from "./Button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title = "Confirmar ação",
  description = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-700 mb-6">{description}</p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
