"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/services/users";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
        role: "customer",
        avatar: "https://i.pravatar.cc/70", // ← imagem padrão
      });
      router.push("/login");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
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
      <div className="flex justify-center my-4">
        <ImageWithFallback
          src="/img/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="w-20"
        />
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">Criar conta</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          placeholder="Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          {loading ? "Criando conta…" : "Registrar"}
        </Button>

        <a
          onClick={() => {
            router.push("/login");
          }}
          className={`w-full flex items-center cursor-pointer gap-3 rounded px-3 py-2 text-sm font-medium
                ${isLight ? "text-gray-700" : "text-white"}`}
        >
          Login
        </a>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
