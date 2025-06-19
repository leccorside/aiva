"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { uploadImage } from "@/services/products";
import { updateUser } from "@/services/users";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user, setUser } = useAuth();
  const isLight = theme === "light";

  const containerClass = isLight
    ? "bg-white text-gray-800"
    : "bg-gray-800 text-gray-100";

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role || "customer");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      let avatar = imagePreview;
      if (imageFile) {
        avatar = await uploadImage(imageFile);
      }

      const data: {
        name: string;
        email: string;
        role: string;
        avatar: string;
        password?: string;
      } = {
        name,
        email,
        role,
        avatar,
      };

      if (password) {
        data.password = password;
      }

      const result = await updateUser(user!.id, data);
      setUser(result);
      localStorage.setItem("user", JSON.stringify(result));

      setStatusMessage("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil", err);
      setStatusMessage("Erro ao atualizar perfil");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ⏳ Esconde a mensagem após 4 segundos
  useEffect(() => {
    if (statusMessage) {
      const timeout = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [statusMessage]);

  return (
    <ProtectedRoute>
      <div
        className={`mx-auto mt-10 rounded-lg shadow-md p-6 max-w-7xl ${containerClass}`}
      >
        <h1 className="text-2xl font-bold mb-6">Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <ImageWithFallback
                src={
                  imagePreview.includes("/api/v1/files/")
                    ? `/api/proxy/${imagePreview.split("/").pop()}`
                    : imagePreview || "/img/placeholder.jpg"
                }
                alt="Avatar preview"
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`w-full rounded px-3 py-2 border transition ${
                  isLight
                    ? "bg-white text-gray-900 border-gray-300"
                    : "bg-gray-900 text-white border-gray-600"
                }`}
              />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  placeholder="Nome"
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded px-3 py-2 border transition ${
                    isLight
                      ? "bg-white text-gray-900 border-gray-300"
                      : "bg-gray-900 text-white border-gray-600"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="E-mail"
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded px-3 py-2 border transition ${
                    isLight
                      ? "bg-white text-gray-900 border-gray-300"
                      : "bg-gray-900 text-white border-gray-600"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Deixe em branco se não quiser alterar"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded px-3 py-2 border transition ${
                    isLight
                      ? "bg-white text-gray-900 border-gray-300"
                      : "bg-gray-900 text-white border-gray-600"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Função</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full rounded px-3 py-2 border transition ${
                    isLight
                      ? "bg-white text-gray-900 border-gray-300"
                      : "bg-gray-900 text-white border-gray-600"
                  }`}
                >
                  <option value="admin">Administrador</option>
                  <option value="customer">Cliente</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center mt-6 gap-4">
            {statusMessage && (
              <span
                className={`text-sm ${
                  statusMessage.includes("sucesso")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {statusMessage}
              </span>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
