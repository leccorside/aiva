"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Área protegida</h1>
        <p className="mb-4">Você está logado e pode acessar o dashboard.</p>

        <Button
          onClick={() => setShowConfirm(true)}
          className="text-red-600 text-sm"
        >
          Sair
        </Button>

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
