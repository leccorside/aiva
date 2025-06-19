"use client";

import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "@/services/categories";
import { Button } from "@/components/ui/Button";
import { Edit, Trash, Search } from "lucide-react";
import { useTheme } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import CategoryModal from "@/components/modals/CategoryModal";
import Image from "next/image";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

type CategoryType = {
  id: number;
  name: string;
  image?: string;
};

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
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const [showModal, setShowModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryType | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(
    null
  );
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    setTotalPages(Math.ceil(filtered.length / limit));
    const start = (page - 1) * limit;
    setCategories(filtered.slice(start, start + limit));
  }, [allCategories, page, search]);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      const sorted = data.sort(
        (a: CategoryType, b: CategoryType) => b.id - a.id
      );
      setAllCategories(sorted);
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1
            className={`text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Categorias
          </h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span
                className={`absolute left-3 top-2.5 ${
                  isLight ? "text-gray-400" : "text-gray-300"
                }`}
              >
                <Search size={16} />
              </span>
              <input
                className={`pl-9 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 ${
                  isLight
                    ? "border border-gray-300 focus:ring-blue-500 bg-white text-gray-900"
                    : "border border-gray-600 bg-gray-800 text-white focus:ring-blue-400 placeholder-gray-400"
                }`}
                placeholder="Buscar Categoria..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                type="text"
              />
            </div>
            <Button
              size="sm"
              className="py-2"
              onClick={() => setShowModal(true)}
            >
              +<span className="hidden md:inline ml-1">Nova Categoria</span>
            </Button>
          </div>
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
                <ImageWithFallback
                  src={resolveImageUrl(cat.image)}
                  alt={cat.name}
                  width={48}
                  height={48}
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

        {totalPages > 1 && (
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
        )}

        {(showModal || categoryToEdit) && (
          <CategoryModal
            category={categoryToEdit}
            onClose={() => {
              setShowModal(false);
              setCategoryToEdit(null);
            }}
            onCategorySaved={() => {
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
