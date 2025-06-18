// services/users.ts
import { API_BASE_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  password?: string; // caso o backend permita criação/edição de senha
};

// Buscar usuários com paginação
export async function getUsers(page = 1, limit = 10) {
  const totalLimit = 250;
  const totalRes = await fetch(
    `${API_BASE_URL}/users?offset=0&limit=${totalLimit}`
  );
  if (!totalRes.ok) throw new Error("Erro ao buscar os usuários mais recentes");

  const allRecentProducts = await totalRes.json();

  const sorted = allRecentProducts.sort((a: any, b: any) => b.id - a.id);
  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return paginated;
}

// Criar novo usuário
export async function createUser(data: {
  name: string;
  email: string;
  role: string;
  password: string;
  avatar?: string;
}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar usuário");

  return res.json();
}

// Editar usuário existente
export async function updateUser(
  id: number,
  data: {
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    avatar?: string;
  }
) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao atualizar usuário");

  return res.json();
}

// Deletar usuário
export async function deleteUser(id: number) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao deletar usuário");

  return res.json();
}

// Atualizar perfil
export async function updateUserProfile(data: {
  name: string;
  email: string;
  role: string;
  avatar: string;
  password?: string;
}) {
  const token = getToken();

  // Remover campos vazios ou undefined
  const payload: any = {
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar,
  };

  if (data.password?.trim()) {
    payload.password = data.password;
  }

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Detalhes do erro:", errorData);
    throw new Error("Erro ao atualizar perfil");
  }

  return res.json();
}
