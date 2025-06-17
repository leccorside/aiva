import { API_BASE_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error("Erro ao buscar categorias");
  return res.json();
}

export async function createCategory(data: { name: string; image: string }) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar categoria");

  return res.json();
}

export async function updateCategory(
  id: number,
  data: {
    name: string;
    image: string;
  }
) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao atualizar categoria");

  return res.json();
}

export async function deleteCategory(id: number) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao deletar categoria");

  return res.json();
}
