import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export async function getProducts(offset = 0, limit = 10) {
  const res = await fetch(
    `${API_BASE_URL}/products?offset=${offset}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  return res.json();
}

export async function getTotalProductsCount() {
  const res = await fetch(`${API_BASE_URL}/products`);
  const data = await res.json();
  return data.length; // a API retorna tudo, então usamos length
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
