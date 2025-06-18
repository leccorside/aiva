import { API_BASE_URL } from "@/lib/api";

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export async function login(
  email: string,
  password: string
): Promise<{
  access_token: string;
  user: UserProfile;
}> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Falha no login");
  }

  const { access_token }: LoginResponse = await res.json();

  // Buscar perfil do usuário após obter token
  const user = await getProfile(access_token);

  return { access_token, user };
}

export async function getProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar perfil");
  }

  return res.json(); // deve conter { id, name, email, role, avatar }
}
