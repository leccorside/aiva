"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { getTotalProductsCount } from "@/services/products";
import { Button } from "@/components/ui/Button";
import { Eye, Edit, Trash, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import NewProductModal from "@/components/modals/NewProductModal";
import ProductDetailsModal from "@/components/modals/ProductDetailsModal";

export default function ProductManager() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const limit = 10;
  const { products } = useProducts(page);
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const total = await getTotalProductsCount();
      setTotalPages(Math.ceil(total / limit));
    })();
  }, []);

  const truncate = (text: string, maxWords = 10) =>
    text.split(" ").slice(0, maxWords).join(" ") + "...";

  const highlight = (text: string) =>
    search
      ? text.replace(
          new RegExp(`(${search})`, "gi"),
          '<mark class="bg-yellow-200">$1</mark>'
        )
      : text;

  const filtered = products.filter(
    (p: any) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const isLight = theme === "light";

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1
          className={`text-2xl font-bold ${
            isLight ? "text-gray-900" : "text-white"
          }`}
        >
          Products
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              type="text"
            />
          </div>
          <Button size="sm" className="py-2" onClick={() => setShowModal(true)}>
            + Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        className={`w-full overflow-x-auto rounded-md border shadow ${
          isLight
            ? "bg-white border-gray-600"
            : "bg-gray-900 border-gray-700 text-white"
        }`}
      >
        <table className="min-w-[700px] w-full text-sm">
          <thead
            className={`${
              isLight ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"
            }`}
          >
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isLight ? "divide-gray-200" : "divide-gray-700"
            }`}
          >
            {filtered.map((product: any) => (
              <tr
                key={product.id}
                className={`${
                  isLight ? "hover:bg-gray-100" : "hover:bg-gray-800"
                }`}
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div
                      className={`font-medium ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: highlight(product.title),
                      }}
                    />
                    <div
                      className={`text-sm ${
                        isLight ? "text-gray-500" : "text-gray-300"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: highlight(truncate(product.description, 10)),
                      }}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={product.category?.image}
                      alt={product.category?.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{product.category?.name}</span>
                  </div>
                </td>
                <td className="p-4">{product.id}</td>
                <td className="p-4">R$ {product.price}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button size="sm" variant="danger">
                      <Trash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* New Product Modal */}
      {showModal && <NewProductModal onClose={() => setShowModal(false)} />}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
