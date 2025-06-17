"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const containerClass =
    theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-100";

  const infoBoxClass =
    theme === "light"
      ? "bg-gray-100 text-gray-700 border"
      : "bg-gray-900 text-white border border-gray-700";

  const logoutBtnClass = theme === "light" ? "text-red-600" : "text-red-400";

  return (
    <ProtectedRoute>
      <div
        className={`mx-auto mt-10 rounded-lg shadow-md p-6 ${containerClass}`}
      >
        <h1 className="text-2xl font-bold mb-2">Área protegida</h1>
        <p className="mb-4 text-sm">
          Você está logado e pode acessar o dashboard.
        </p>

        <Button
          onClick={() => setShowConfirm(true)}
          className={`text-sm ${logoutBtnClass}`}
        >
          Sair
        </Button>

        <div className={`mt-6 rounded-md p-4 ${infoBoxClass}`}>
          Tema dinâmico!
        </div>

        <ConfirmModal
          open={showConfirm}
          title="Deseja sair da conta?"
          description="Você será desconectado da aplicação."
          confirmText="Sim, sair"
          cancelText="Cancelar"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
