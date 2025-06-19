"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser, type UserType } from "@/services/users"; // ← usa o MESMO tipo
import { Button } from "@/components/ui/Button";
import { Edit, Trash, Search } from "lucide-react";
import { useTheme } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import UserModal from "@/components/modals/UserModal";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function UserManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFiltered] = useState<UserType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);
  const [userToDelete, setUserDelete] = useState<UserType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const limit = 10;
  const { theme } = useTheme();
  const isLight = theme === "light";

  /* ───────────── fetch inicial ───────────── */
  useEffect(() => {
    (async () => {
      const fetched = await getUsers(1, 1000);
      setAllUsers(fetched);
    })();
  }, []);

  /* ───────────── busca / filtro ───────────── */
  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
    setFiltered(filtered);
    setPage(1);
  }, [search, allUsers]);

  /* ───────────── paginação ───────────── */
  useEffect(() => {
    const start = (page - 1) * limit;
    setUsers(filteredUsers.slice(start, start + limit));
  }, [page, filteredUsers]);

  /* ───────────── helpers ───────────── */
  const highlight = (txt: string) =>
    search
      ? txt.replace(
          new RegExp(`(${search})`, "gi"),
          '<mark class="bg-yellow-200">$1</mark>'
        )
      : txt;

  const resolveImg = (img?: string) =>
    img
      ? img.includes("/api/v1/files/")
        ? `/api/proxy/${img.split("/").pop()}`
        : img
      : "https://i.pravatar.cc/70";

  /* ───────────── excluir ───────────── */
  const handleDelete = async () => {
    if (!userToDelete) return;
    await deleteUser(userToDelete.id);
    setAllUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setUserDelete(null);
  };

  /* ───────────── UI ───────────── */
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header + busca */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1
            className={`text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Usuários
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Campo de busca */}
            <div className="relative w-full md:w-64">
              <span
                className={`absolute left-3 top-2.5 ${
                  isLight ? "text-gray-400" : "text-gray-300"
                }`}
              >
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Buscar Usuário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-9 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 ${
                  isLight
                    ? "border border-gray-300 focus:ring-blue-500 bg-white text-gray-900"
                    : "border border-gray-600 bg-gray-800 text-white focus:ring-blue-400 placeholder-gray-400"
                }`}
              />
            </div>

            {/* Botão novo usuário */}
            <Button
              size="sm"
              className="py-2"
              onClick={() => setShowModal(true)}
            >
              +<span className="hidden md:inline ml-1">Novo Usuário</span>
            </Button>
          </div>
        </div>

        {/* Lista */}
        <div className="grid gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className={`rounded-md border shadow-md p-4 flex justify-between items-center gap-4 transition ${
                isLight
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-gray-900 border-gray-700 text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={resolveImg(u.avatar)}
                  alt={u.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-full border"
                />
                <div>
                  <div
                    className="font-semibold"
                    dangerouslySetInnerHTML={{ __html: highlight(u.name) }}
                  />
                  <div
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: highlight(u.email) }}
                  />
                  <div className="text-xs text-gray-400">{u.role}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => setUserToEdit(u)}>
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setUserDelete(u)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        {Math.ceil(filteredUsers.length / limit) > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from(
              { length: Math.ceil(filteredUsers.length / limit) },
              (_, i) => i + 1
            ).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === page ? "primary" : "secondary"}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        )}

        {/* Modal criar / editar */}
        {(showModal || userToEdit) && (
          <UserModal
            user={userToEdit ?? undefined}
            onClose={() => {
              setShowModal(false);
              setUserToEdit(null);
            }}
            onUserSaved={(saved) => {
              setShowModal(false);
              setUserToEdit(null);
              setAllUsers((prev) => {
                const idx = prev.findIndex((u) => u.id === saved.id);
                return idx === -1
                  ? [saved, ...prev]
                  : prev.map((u) => (u.id === saved.id ? saved : u));
              });
            }}
          />
        )}

        {/* Confirmação de exclusão */}
        {userToDelete && (
          <ConfirmModal
            open={true}
            title="Remover Usuário"
            description={`Deseja remover o usuário '${userToDelete.name}'?`}
            onCancel={() => setUserDelete(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
