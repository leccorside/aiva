"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  /* ───────────── state ───────────── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ─────────── redirect if logged ─────────── */
  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  /* ─────────── handlers ─────────── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
    } catch (error) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  /* ─────────── UI ─────────── */
  return (
    <div
      className={`max-w-sm mx-auto mt-20 p-6 rounded shadow transition-colors ${
        isLight
          ? "bg-white text-gray-800"
          : "bg-gray-800 text-gray-100 border border-gray-700"
      }`}
    >
      {/* logo */}
      <div className="flex justify-center my-4">
        <ImageWithFallback
          src="/img/logo.svg"
          alt="Logo"
          width={50}
          height={50}
          className="w-20"
        />
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">Faça login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Entrando…" : "Entrar"}
        </Button>

        <div className="text-xl mb-4 text-center">
          <a
            onClick={() => {
              router.push("/register");
            }}
            className={`w-full flex items-center cursor-pointer gap-3 rounded px-3 py-2 text-sm font-medium
                ${isLight ? "text-gray-700" : "text-white"}`}
          >
            Registre-se
          </a>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
