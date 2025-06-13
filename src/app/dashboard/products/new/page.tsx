"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createProduct, getCategories, uploadImage } from "@/services/products";
import type { CategoryType } from "@/services/products";

interface NewProductModalProps {
  onClose: () => void;
}

export default function NewProductModal({ onClose }: NewProductModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) return alert("Escolha uma imagem");

    setIsSubmitting(true);
    try {
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }

      await createProduct({
        title,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
        images: imageUrls,
      });

      onClose();
    } catch (err) {
      console.error("Erro ao criar produto", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Novo Produto</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
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
                const previewUrls = fileArray.map((file) =>
                  URL.createObjectURL(file)
                );
                setImagePreviews(previewUrls);
              }
            }}
            required
            className="w-full border rounded px-3 py-2"
          />

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
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
