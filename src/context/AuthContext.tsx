"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, clearToken } from "@/lib/auth";
import { login as loginService, getProfile } from "@/services/auth";

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  async function login(email: string, password: string) {
    const res = await loginService(email, password);
    const access_token = res.access_token;

    saveToken(access_token);
    setToken(access_token);

    try {
      const profile = await getProfile(access_token);
      const userData: User = {
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        role: profile.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
    }
  }

  function logout() {
    clearToken();
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
