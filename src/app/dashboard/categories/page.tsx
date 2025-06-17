"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categories";
import { Button } from "@/components/ui/Button";
import { Edit, Trash } from "lucide-react";
import { useTheme } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import CategoryModal from "@/components/modals/CategoryModal";

function resolveImageUrl(image?: string) {
  if (!image) return "/img/placeholder.jpg";

  const isInvalidDashboardPath = image.startsWith("/dashboard/");
  const isFileProxy = image.includes("/api/v1/files/");
  const isHttp = image.startsWith("http");

  if (isInvalidDashboardPath || (!isFileProxy && !isHttp)) {
    return "/img/placeholder.jpg";
  }

  return isFileProxy ? `/api/proxy/${image.split("/").pop()}` : image;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [showModal, setShowModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    fetchCategories();
  }, [page]);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      const sorted = data.sort((a: any, b: any) => b.id - a.id);
      setTotalPages(Math.ceil(sorted.length / limit));
      const start = (page - 1) * limit;
      setCategories(sorted.slice(start, start + limit));
    } catch (err) {
      console.error("Erro ao buscar categorias", err);
    }
  }

  async function handleDelete(id: number) {
    await deleteCategory(id);
    fetchCategories();
    setCategoryToDelete(null);
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Categorias
          </h1>
          <Button size="sm" onClick={() => setShowModal(true)}>
            + Nova Categoria
          </Button>
        </div>

        <div className="grid gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-md border shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition ${
                isLight
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-gray-900 border-gray-700 text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={resolveImageUrl(cat.image)}
                  alt={cat.name}
                  className="w-12 h-12 object-cover rounded border"
                />
                <div className="font-medium text-lg">{cat.name}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setCategoryToEdit(cat)}>
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setCategoryToDelete(cat)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "primary" : "secondary"}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
        </div>

        {(showModal || categoryToEdit) && (
          <CategoryModal
            category={categoryToEdit}
            onClose={() => {
              setShowModal(false);
              setCategoryToEdit(null);
            }}
            onCategorySaved={(saved) => {
              setShowModal(false);
              setCategoryToEdit(null);
              fetchCategories();
            }}
          />
        )}

        {categoryToDelete && (
          <ConfirmModal
            open={!!categoryToDelete}
            title="Remover categoria"
            description={`Deseja remover a categoria '${categoryToDelete.name}'?`}
            onCancel={() => setCategoryToDelete(null)}
            onConfirm={() => handleDelete(categoryToDelete.id)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
