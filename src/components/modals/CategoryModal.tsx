"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";
import { createCategory, updateCategory } from "@/services/categories";
import { uploadImage } from "@/services/products";
import ImageWithFallback from "../ui/ImageWithFallback";

export type CategoryType = {
  id: number;
  name: string;
  image?: string;
};

interface CategoryModalProps {
  category?: CategoryType | null;
  onClose: () => void;
  onCategorySaved: (saved: CategoryType) => void;
}

export default function CategoryModal({
  category,
  onClose,
  onCategorySaved,
}: CategoryModalProps) {
  const [name, setName] = useState(category?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    setName(category?.name || "");
    setImagePreview(category?.image || null);
    setImageFile(null);
  }, [category]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const data = {
        name,
        image: imageUrl || "https://i.pravatar.cc/1000",
      };

      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      onCategorySaved(result);
    } catch (err) {
      console.error("Erro ao salvar categoria", err);
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
          {category ? "Editar Categoria" : "Nova Categoria"}
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
                src={imagePreview}
                alt="Prévia da imagem"
                width={96}
                height={96}
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
