"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Redirecionar para /dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Email ou senha inválidos");
    }
  }

  return (
    <div
      className={`max-w-sm mx-auto mt-20 p-6 rounded shadow transition-colors ${
        isLight
          ? "bg-white text-gray-800"
          : "bg-gray-800 text-gray-100 border border-gray-700"
      }`}
    >
      <div className="flex justify-center items-center my-4">
        <img src="/img/logo.svg" alt="Logo" className="w-20" />
      </div>
      <h2 className="text-xl font-bold mb-4">Faça Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Entrar</Button>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}
