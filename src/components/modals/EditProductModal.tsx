// components/modals/EditProductModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { updateProduct, getCategories, uploadImage } from "@/services/products";
import type { CategoryType } from "@/services/products";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onProductUpdated: (updatedProduct: any) => void;
}

export default function EditProductModal({
  product,
  onClose,
  onProductUpdated,
}: EditProductModalProps) {
  const [title, setTitle] = useState(product.title || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [categoryId, setCategoryId] = useState(product.category?.id || "");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product.images || []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let uploadedImageUrls: string[] = [];

      for (const file of imageFiles) {
        const url = await uploadImage(file);
        uploadedImageUrls.push(url);
      }

      const updated = await updateProduct(product.id, {
        title,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
        images: [...existingImages, ...uploadedImageUrls],
      });

      onProductUpdated(updated);
    } catch (err) {
      console.error("Erro ao atualizar produto", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resolveImageUrl(url: string) {
    if (!url) return "/placeholder.jpg";
    return url.includes("/api/v1/files/")
      ? `/api/proxy/${url.split("/").pop()}`
      : url;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-6 rounded-md w-full max-w-xl shadow-lg border transition ${
          isLight
            ? "bg-white border-gray-200 text-gray-900"
            : "bg-gray-800 border-gray-700 text-gray-100"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Editar Produto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const fileArray = Array.from(files);
                setImageFiles(fileArray);
                setImagePreviews(
                  fileArray.map((file) => URL.createObjectURL(file))
                );
              }
            }}
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          <div className="flex flex-wrap gap-4 mt-2">
            {existingImages.map((src, index) => (
              <div key={`existing-${index}`} className="relative">
                <img
                  src={resolveImageUrl(src)}
                  alt={`Imagem existente ${index + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() =>
                    setExistingImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {imagePreviews.map((src, index) => (
              <div key={`preview-${index}`} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => {
                    setImagePreviews((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                    setImageFiles((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
