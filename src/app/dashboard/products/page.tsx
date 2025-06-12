"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/Button";
import { getTotalProductsCount } from "@/services/products";

export default function ProductManager() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const { products, isLoading, isError } = useProducts(page);

  useEffect(() => {
    async function fetchTotal() {
      const total = await getTotalProductsCount();
      setTotalPages(Math.ceil(total / limit));
    }
    fetchTotal();
  }, []);

  const truncateWords = (text: string, maxWords = 15) =>
    text.split(" ").slice(0, maxWords).join(" ") + "...";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>

      {isLoading && <p>Carregando...</p>}
      {isError && <p className="text-red-500">Erro ao carregar produtos.</p>}

      <ul className="space-y-4 mb-8">
        {products.map((product: any) => (
          <li
            key={product.id}
            className="border p-4 rounded shadow flex items-start justify-between gap-4"
          >
            <div className="flex gap-4">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="w-28 h-28 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-gray-500 text-sm mb-1">
                  <span className="font-medium">Preço:</span> R$ {product.price}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-medium">Categoria:</span>{" "}
                  {product.category?.name}
                </p>
                <p className="text-gray-600 text-sm">
                  {truncateWords(product.description, 15)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <Button size="sm" variant="secondary">
                Ver
              </Button>
              <Button size="sm">Editar</Button>
              <Button size="sm" variant="danger">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Paginação */}
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "primary" : "secondary"}
            onClick={() => setPage(p)}
            size="sm"
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );
}
