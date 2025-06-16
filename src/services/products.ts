import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export interface CategoryType {
  id: number;
  name: string;
  image: string;
}

export async function getProducts(page = 1, limit = 10) {
  const totalLimit = 50;
  const totalRes = await fetch(
    `${API_BASE_URL}/products?offset=0&limit=${totalLimit}`
  );
  if (!totalRes.ok) throw new Error("Erro ao buscar os produtos mais recentes");

  const allRecentProducts = await totalRes.json();

  // Ordena por mais recente (desc) assumindo que o produto mais novo vem por último
  const sorted = allRecentProducts.sort((a: any, b: any) => b.id - a.id);

  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return paginated;
}

export async function getTotalProductsCount() {
  const res = await fetch(`${API_BASE_URL}/products`);
  const data = await res.json();
  return data.length;
}

export async function createProduct(data: {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar produto");
  }

  return res.json();
}

export async function updateProduct(
  id: number,
  data: Partial<Parameters<typeof createProduct>[0]>
) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar produto");
  }

  return res.json();
}

export async function getCategories(): Promise<CategoryType[]> {
  const res = await fetch(`${API_BASE_URL}/categories`);

  if (!res.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Erro ao enviar imagem");

  const data = await res.json();
  return data.location;
}
