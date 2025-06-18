"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/services/users";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "next-themes";
import { Users, ShoppingBag, Layers2 } from "lucide-react";

export default function DashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers(1, 1000);
      const products = await getProducts(1, 1000);
      const categories = await getCategories();

      setUserCount(users.length);
      setProductCount(products.length);
      setCategoryCount(categories.length);
    }

    fetchData();
  }, []);

  const cardStyle = `rounded-lg border shadow-md p-6 flex-1 text-center transition ${
    isLight
      ? "bg-white border-gray-200 text-gray-900"
      : "bg-gray-800 border-gray-700 text-white"
  }`;

  const iconBox = (bg: string, Icon: React.ReactNode) => (
    <div className={`w-10 h-10 flex items-center justify-center rounded ${bg}`}>
      {Icon}
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <h1 className="text-2xl font-bold mb-6">Visão Geral</h1>
      </div>
      <div className="max-w-7xl mx-auto mt-5 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <div className="flex items-center gap-4 justify-center">
            {iconBox("bg-violet-100 text-violet-600", <Users size={20} />)}
            <span className="text-2xl font-bold">{userCount}</span>
          </div>
          <div className="text-sm mt-1">Total de usuários</div>
        </div>

        <div className={cardStyle}>
          <div className="flex items-center gap-4 justify-center">
            {iconBox(
              "bg-orange-100 text-orange-600",
              <ShoppingBag size={20} />
            )}
            <span className="text-2xl font-bold">{productCount}</span>
          </div>
          <div className="text-sm mt-1">Total de produtos</div>
        </div>

        <div className={cardStyle}>
          <div className="flex items-center gap-4 justify-center">
            {iconBox("bg-red-100 text-red-600", <Layers2 size={20} />)}
            <span className="text-2xl font-bold">{categoryCount}</span>
          </div>
          <div className="text-sm mt-1">Total de categorias</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
