"use client";

import { useTheme } from "next-themes";
import { CategoryType } from "@/services/products";
import { Button } from "@/components/ui/Button";

interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: CategoryType;
}

interface Props {
  product: ProductType;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`p-6 rounded-md w-full max-w-xl shadow-lg border transition ${
          isLight
            ? "bg-white border-gray-200 text-gray-900"
            : "bg-gray-800 border-gray-700 text-gray-100"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">{product.title}</h2>

        <p className="mb-2 text-sm">{product.description}</p>
        <p className="mb-2">
          <strong>Preço:</strong> R$ {product.price}
        </p>
        <p className="mb-4">
          <strong>Categoria:</strong> {product.category?.name}
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          {product.images.map((img, idx) => (
            <img
              src={
                product.images?.[0]?.includes("/api/v1/files/")
                  ? `/api/proxy/${product.images[0].split("/").pop()}`
                  : product.images?.[0]
              }
              alt={product.title}
              className="w-24 h-24 rounded object-cover border"
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
