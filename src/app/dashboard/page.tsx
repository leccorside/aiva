"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/Button";
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

        {/* Modal de confirmação */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
              <p className="mb-4 text-gray-800 font-medium">
                Tem certeza que deseja sair?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2"
                >
                  Sim, sair
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
