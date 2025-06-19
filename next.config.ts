// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Quando ativado, Next.js *não processa* as imagens pelo loader interno.
    // Isso permite usar qualquer URL, inclusive externas ou blobs.
    unoptimized: true,
  },

  // Opcional: Ativa o modo estrito do React
  reactStrictMode: true,

  // Opcional: configura domínios permitidos caso queira reativar otimização
  // images: {
  //   domains: ["i.pravatar.cc", "api.escuelajs.co", "localhost"],
  // },

  // Outras configs podem ser adicionadas aqui conforme necessário
};

export default nextConfig;
