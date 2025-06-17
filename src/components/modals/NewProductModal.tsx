"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { createProduct, getCategories, uploadImage } from "@/services/products";
import type { CategoryType } from "@/services/products";
import { Button } from "@/components/ui/Button";

interface Props {
  onClose: () => void;
  onProductCreated: (product: any) => void;
}

export default function NewProductModal({ onClose, onProductCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
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

  function handleRemoveImage(index: number) {
    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];
    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
      }

      if (imageUrls.length === 0) {
        imageUrls.push("https://placehold.co/600x400?text=Sem+Imagem");
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId: Number(categoryId),
        images: imageUrls,
      };

      console.log("[NewProductModal] Payload:", payload);

      const newProduct = await createProduct(payload);

      onProductCreated(newProduct);
      onClose();
    } catch (err) {
      console.error("Erro ao criar produto", err);
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
        <h2 className="text-xl font-semibold mb-4">Novo Produto</h2>
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
                const previews = fileArray.map((file) =>
                  URL.createObjectURL(file)
                );
                setImageFiles(fileArray);
                setImagePreviews(previews);
              }
            }}
            className={`w-full rounded px-3 py-2 border transition ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
          />

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    title="Remover imagem"
                  >
                    ×
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
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
