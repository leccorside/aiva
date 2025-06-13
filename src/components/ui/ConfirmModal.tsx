"use client";

import { ReactNode } from "react";
import { Button } from "./Button";
import { useTheme } from "next-themes";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`p-6 rounded shadow-md text-center max-w-sm w-full transition-colors ${
          isLight
            ? "bg-white text-gray-900"
            : "bg-gray-800 text-gray-100 border border-gray-600"
        }`}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p
          className={`text-sm mb-6 ${
            isLight ? "text-gray-700" : "text-gray-300"
          }`}
        >
          {description}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 hover:bg-red-700"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onCancel}
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
