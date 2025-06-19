"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CategoryType } from "@/services/products";
import { Button } from "@/components/ui/Button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithFallback from "../ui/ImageWithFallback";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const resolveImageUrl = (url: string) =>
    url.includes("/api/v1/files/") ? `/api/proxy/${url.split("/").pop()}` : url;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null && lightboxIndex < product.images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "ArrowLeft") goToPrev();
        else if (e.key === "ArrowRight") goToNext();
        else if (e.key === "Escape") closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  return (
    <>
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
              <ImageWithFallback
                src={resolveImageUrl(img)}
                key={idx}
                alt={product.title}
                width={50}
                height={50}
                className="w-24 h-24 rounded object-cover border cursor-pointer"
                onClick={() => openLightbox(idx)}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-90 flex items-center justify-center">
          {/* Ícone de Fechar */}
          <button
            className="absolute top-4 right-4 text-white"
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            <X size={32} />
          </button>

          {/* Botão Anterior */}
          {lightboxIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 text-white"
              aria-label="Anterior"
            >
              <ChevronLeft size={48} />
            </button>
          )}

          {/* Imagem ampliada */}
          <ImageWithFallback
            src={resolveImageUrl(product.images[lightboxIndex])}
            alt={`Imagem ${lightboxIndex + 1}`}
            width={1000}
            height={1000}
            className="w-full max-w-[1000px] max-h-[90vh] rounded shadow-lg object-contain transition-transform duration-200"
          />

          {/* Botão Próximo */}
          {lightboxIndex < product.images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 text-white"
              aria-label="Próximo"
            >
              <ChevronRight size={48} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
