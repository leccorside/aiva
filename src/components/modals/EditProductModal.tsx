"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { updateProduct, getCategories, uploadImage } from "@/services/products";
import type { CategoryType } from "@/services/products";
import { Button } from "@/components/ui/Button";
import ImageWithFallback from "../ui/ImageWithFallback";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: CategoryType;
  images: string[];
}

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onProductUpdated: (updatedProduct: Product) => void;
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product.images || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const imageUrls = [...imagePreviews];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
      }

      if (imageUrls.length === 0) {
        imageUrls.push("https://placehold.co/600x400?text=Produto+Sem+Imagem");
      }

      const payload = {
        title,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
        images: imageUrls,
      };

      console.log("[EditProductModal] Payload final:", payload);

      const updated = await updateProduct(product.id, payload);

      // sobrescreve manualmente a categoria baseada na seleção
      const finalProduct = {
        ...updated,
        category: categories.find((cat) => cat.id === Number(categoryId))!,
      };

      onProductUpdated(finalProduct);
    } catch (err) {
      console.error("Erro ao atualizar produto", err);
    } finally {
      setIsSubmitting(false);
    }
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
                setImageFiles((prev) => [...prev, ...fileArray]);
              }
            }}
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          {(imagePreviews.length > 0 || imageFiles.length > 0) && (
            <div className="flex flex-wrap gap-4 mt-2">
              {imagePreviews.map((src, index) => (
                <div key={`existing-${index}`} className="relative">
                  <ImageWithFallback
                    src={
                      src.includes("/api/v1/files/")
                        ? `/api/proxy/${src.split("/").pop()}`
                        : src
                    }
                    alt={`Imagem existente ${index + 1}`}
                    width={50}
                    height={50}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full px-1"
                    onClick={() => removeImage(index)}
                  >
                    x
                  </button>
                </div>
              ))}
              {imageFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative">
                  <ImageWithFallback
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    width={50}
                    height={50}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full px-1"
                    onClick={() => removeNewImage(index)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

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
