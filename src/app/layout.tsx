import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Meu Painel",
  description: "Next + Tailwind + Escuelajs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
