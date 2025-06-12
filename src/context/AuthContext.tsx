"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, clearToken } from "@/lib/auth";
import { login as loginService } from "@/services/auth";

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await loginService(email, password);
    saveToken(access_token);
    setToken(access_token);
  }

  function logout() {
    clearToken();
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
