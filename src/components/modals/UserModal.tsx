"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { createUser, updateUser, type UserType } from "@/services/users";
import { uploadImage } from "@/services/products";
import ImageWithFallback from "../ui/ImageWithFallback";

interface UserModalProps {
  user?: UserType | null;
  onClose: () => void;
  onUserSaved: (saved: UserType) => void;
}

export default function UserModal({
  user,
  onClose,
  onUserSaved,
}: UserModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "customer");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user?.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setRole(user?.role || "customer");
    setImagePreview(user?.avatar || "");
    setImageFile(null);
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let avatar = imagePreview;
      if (imageFile) {
        avatar = await uploadImage(imageFile);
      }

      if (user) {
        // Edição: sem senha
        const data = { name, email, role, avatar };
        const result = await updateUser(user.id, data);
        onUserSaved(result);
      } else {
        // Criação: senha obrigatória
        if (!password) {
          throw new Error("Senha é obrigatória para novo usuário.");
        }

        const data = {
          name,
          email,
          role,
          avatar,
          password,
        };

        const result = await createUser(data);
        onUserSaved(result);
      }
    } catch (err) {
      console.error("Erro ao salvar usuário", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-6 rounded-md w-full max-w-md shadow-lg border transition ${
          isLight
            ? "bg-white border-gray-200 text-gray-900"
            : "bg-gray-800 border-gray-700 text-gray-100"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Editar Usuário" : "Novo Usuário"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          {!user && (
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full rounded px-3 py-2 border transition ${
                isLight
                  ? "bg-white text-gray-900 border-gray-300"
                  : "bg-gray-900 text-white border-gray-600"
              }`}
            />
          )}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          >
            <option value="customer">Cliente</option>
            <option value="admin">Administrador</option>
          </select>

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

          {imagePreview && (
            <div className="relative w-fit mt-2">
              <ImageWithFallback
                src={
                  imagePreview.includes("/api/v1/files/")
                    ? `/api/proxy/${imagePreview.split("/").pop()}`
                    : imagePreview
                }
                alt="Avatar preview"
                width={50}
                height={50}
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 text-xs"
              >
                x
              </button>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
