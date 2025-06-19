import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  password?: string; // caso o backend permita criação/edição de senha
};

// Tipo para payloads de criação/edição de usuário
export type UserPayload = Omit<Partial<UserType>, "id">;

// Buscar usuários com paginação
export async function getUsers(page = 1, limit = 10): Promise<UserType[]> {
  const totalLimit = 250;
  const totalRes = await fetch(
    `${API_BASE_URL}/users?offset=0&limit=${totalLimit}`
  );
  if (!totalRes.ok) throw new Error("Erro ao buscar os usuários mais recentes");

  const allRecentUsers: UserType[] = await totalRes.json();

  // Tipado corretamente, sem usar 'any'
  const sorted = allRecentUsers.sort((a, b) => b.id - a.id);
  const start = (page - 1) * limit;
  return sorted.slice(start, start + limit);
}

// Criar novo usuário
export async function createUser(
  data: Required<UserPayload>
): Promise<UserType> {
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

// Registro de usuário (sem token)
export async function registerUser(
  data: Required<UserPayload>
): Promise<UserType> {
  const payload: UserPayload = {
    ...data,
    avatar: data.avatar || "https://i.pravatar.cc/70",
  };

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Erro ao registrar usuário");

  return res.json();
}

// Editar usuário existente
export async function updateUser(
  id: number,
  data: UserPayload
): Promise<UserType> {
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
export async function deleteUser(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao deletar usuário");
}

// Atualizar perfil do usuário logado
export async function updateUserProfile(data: {
  name: string;
  email: string;
  role: string;
  avatar: string;
  password?: string;
}): Promise<UserType> {
  const token = getToken();

  // Monta payload usando UserPayload
  const payload: UserPayload = {
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar,
    ...(data.password?.trim() && { password: data.password }),
  };

  const res = await fetch(`${API_BASE_URL}/users/profile`, {
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
