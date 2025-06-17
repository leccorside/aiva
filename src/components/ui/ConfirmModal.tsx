"use client";

import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`p-6 rounded shadow-md text-center w-full max-w-sm animate-fadeIn transition-colors ${
          isLight
            ? "bg-white text-gray-900"
            : "bg-gray-800 text-gray-100 border border-gray-600"
        }`}
      >
        <div className="text-3xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p
          className={`text-sm mb-6 ${
            isLight ? "text-gray-700" : "text-gray-300"
          }`}
        >
          {description}
        </p>
        <div className="flex justify-center gap-3">
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onCancel}
            autoFocus
            className={`px-4 py-2 ${
              isLight
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
