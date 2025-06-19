import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Desabilita otimização e permite qualquer URL externa
  },
};

export default nextConfig;
