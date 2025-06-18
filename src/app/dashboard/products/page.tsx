"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  getTotalProductsCount,
} from "@/services/products";
import { Button } from "@/components/ui/Button";
import { Eye, Edit, Trash, Search } from "lucide-react";
import { useTheme } from "next-themes";
import NewProductModal from "@/components/modals/NewProductModal";
import ProductDetailsModal from "@/components/modals/ProductDetailsModal";
import EditProductModal from "@/components/modals/EditProductModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { getCategories } from "@/services/categories";

export default function ProductManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number>(1000);
  const limit = 10;
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    (async () => {
      const all = await getProducts(1, 1000);
      const sorted = all.sort((a: any, b: any) => b.id - a.id);
      setAllProducts(sorted);
      const cats = await getCategories();
      setCategories(cats);
    })();
  }, []);

  useEffect(() => {
    const filtered = allProducts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !selectedCategory || p.category?.name === selectedCategory;
      const matchesPrice = p.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
    setFilteredProducts(filtered);
    setPage(1);
  }, [search, selectedCategory, priceRange, allProducts]);

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setProducts(filteredProducts.slice(start, end));
  }, [page, filteredProducts]);

  const truncate = (text: string, maxWords = 6) =>
    text.split(" ").slice(0, maxWords).join(" ") + "...";

  const highlight = (text: string) =>
    search
      ? text.replace(
          new RegExp(`(${search})`, "gi"),
          '<mark class="bg-yellow-200">$1</mark>'
        )
      : text;

  function resolveImageUrl(image?: string) {
    if (!image) return "/img/placeholder.jpg";
    const filename = image.split("/").pop();
    return image.includes("/api/v1/files/") ? `/api/proxy/${filename}` : image;
  }

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      setAllProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    } catch (err) {
      console.error("Erro ao deletar produto", err);
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1
            className={`text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Produtos
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
                placeholder="Buscar Produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
              />
            </div>
            <Button
              size="sm"
              className="py-2"
              onClick={() => setShowModal(true)}
            >
              +<span className="hidden md:inline ml-1">Novo Produto</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className={`w-full md:w-auto p-2 rounded border text-sm ${
              isLight
                ? "bg-white text-gray-900 border-gray-300"
                : "bg-gray-900 text-white border-gray-600"
            }`}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 w-full md:w-auto p-2 text-sm">
            <label className="text-sm">Preço até R$ {priceRange}</label>
            <input
              type="range"
              min={0}
              max={1000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {products.map((product: any) => (
            <div
              key={product.id}
              className={`rounded-md border shadow-md p-4 transition grid grid-cols-1 sm:grid-cols-3 gap-4 ${
                isLight
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-gray-900 border-gray-700 text-white"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={resolveImageUrl(product.images?.[0])}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <div
                    className="font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: highlight(product.title),
                    }}
                  />
                  <div
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: highlight(truncate(product.description)),
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <div className="flex items-center gap-2">
                  {product.category?.image && (
                    <img
                      src={resolveImageUrl(product.category.image)}
                      alt={product.category.name}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">
                    {product.category?.name}
                  </span>
                </div>
                <div className="text-sm font-bold">R$ {product.price}</div>
              </div>
              <div className="flex gap-2 justify-start items-center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye size={16} />
                </Button>
                <Button size="sm" onClick={() => setProductToEdit(product)}>
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setProductToDelete(product)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {Math.ceil(filteredProducts.length / limit) > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from(
              { length: Math.ceil(filteredProducts.length / limit) },
              (_, i) => i + 1
            ).map((p) => (
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

        {showModal && (
          <NewProductModal
            onClose={() => setShowModal(false)}
            onProductCreated={(newProduct) => {
              setAllProducts((prev) => [newProduct, ...prev]);
              setShowModal(false);
            }}
          />
        )}

        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {productToEdit && (
          <EditProductModal
            product={productToEdit}
            onClose={() => setProductToEdit(null)}
            onProductUpdated={(updated) => {
              setAllProducts((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              );
              setProductToEdit(null);
            }}
          />
        )}

        {productToDelete && (
          <ConfirmModal
            open={true}
            title="Remover Produto"
            description="Tem certeza que deseja remover este produto?"
            onConfirm={handleDelete}
            onCancel={() => setProductToDelete(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
