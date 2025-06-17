"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Sun,
  Moon,
  User,
  Settings,
  DollarSign,
  HelpCircle,
  LogOut,
  Layers2,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "../ui/ConfirmModal";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const { user, logout } = useAuth();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLight = theme === "light";

  const menu = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    {
      href: "/dashboard/products",
      label: "Produtos",
      icon: <ShoppingBag size={18} />,
    },
    {
      href: "/dashboard/categories",
      label: "Categorias",
      icon: <Layers2 size={18} />,
    },
    {
      href: "/dashboard/users",
      label: "Usuários",
      icon: <Users size={18} />,
    },
  ];

  const [showConfirm, setShowConfirm] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function resolveImageUrl(image?: string) {
    if (!image) return "/img/placeholder.jpg";
    const filename = image.split("/").pop();
    return image.includes("/api/v1/files/") ? `/api/proxy/${filename}` : image;
  }

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        isLight ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r shadow-sm transition-transform duration-200 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static
        ${
          isLight ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-4">
          {menu.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium
                ${
                  pathname === href
                    ? "bg-gray-100 text-blue-600"
                    : isLight
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-gray-700"
                }`}
              onClick={() => setSidebarOpen(false)}
            >
              {icon} {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header
          className={`flex h-16 items-center justify-between px-4 shadow-sm
    ${
      isLight
        ? "bg-white border-b border-gray-200 text-black"
        : "bg-gray-800 border-b border-gray-700 text-white"
    }`}
        >
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Espaço flexível para empurrar o conteúdo para a direita */}
          <div className="flex-1" />

          <div className="relative flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded transition hover:opacity-80 ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <img
                  src={resolveImageUrl(
                    user?.avatar || "https://i.pravatar.cc/70"
                  )}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border"
                />
              </button>

              {userMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg border z-50 ${
                    theme === "light"
                      ? "bg-white text-gray-700 border-gray-200"
                      : "bg-gray-800 text-gray-100 border-gray-700"
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">
                      {user?.name || "Usuário"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "email@exemplo.com"}
                    </p>
                  </div>

                  <ul className="text-sm">
                    <li>
                      <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <User size={16} /> Perfil
                      </button>
                    </li>
                  </ul>

                  <div className="px-4 py-2">
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Logout <LogOut size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 ${
            isLight ? "bg-gray-50 text-black" : "bg-gray-900 text-white"
          }`}
        >
          {children}
        </main>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Deseja sair da conta?"
        description="Você será desconectado da aplicação."
        confirmText="Sim, sair"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
