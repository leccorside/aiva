import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export interface CategoryType {
  id: number;
  name: string;
  image: string;
}

export type ProductType = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: CategoryType;
  images: string[];
};

export async function getProducts(
  page = 1,
  limit = 10
): Promise<ProductType[]> {
  const totalLimit = 250;
  const totalRes = await fetch(
    `${API_BASE_URL}/products?offset=0&limit=${totalLimit}`
  );
  if (!totalRes.ok) throw new Error("Erro ao buscar os produtos mais recentes");

  // Tipando o retorno como ProductType[] para eliminar 'any'
  const allRecentProducts: ProductType[] = await totalRes.json();

  // Agora os parâmetros 'a' e 'b' são inferidos como ProductType
  const sorted = allRecentProducts.sort((a, b) => b.id - a.id);
  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return paginated;
}

export async function getTotalProductsCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Erro ao buscar contagem de produtos");

  const data: ProductType[] = await res.json();
  return data.length;
}

export async function createProduct(data: {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}): Promise<ProductType> {
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
  data: {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
  }
): Promise<ProductType> {
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
    const errorBody = await res.json();
    console.error("[updateProduct] API Error:", errorBody);
    throw new Error("Erro ao atualizar produto");
  }

  return res.json();
}

export async function deleteProduct(id: number): Promise<boolean> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar produto");
  }

  return true;
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

  const data: { location: string } = await res.json();
  return data.location;
}
