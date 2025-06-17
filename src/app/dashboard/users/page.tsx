"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/services/users";
import { Button } from "@/components/ui/Button";
import { Eye, Edit, Trash, Search } from "lucide-react";
import { useTheme } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import UserModal from "@/components/modals/UserModal";

export default function UserManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 10;
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    (async () => {
      const fetched = await getUsers(1, 1000);
      setAllUsers(fetched);
    })();
  }, []);

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setUsers(allUsers.slice(start, end));
  }, [page, allUsers]);

  const highlight = (text: string) =>
    search
      ? text.replace(
          new RegExp(`(${search})`, "gi"),
          '<mark class="bg-yellow-200">$1</mark>'
        )
      : text;

  const filtered = users.filter(
    (u: any) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function resolveImageUrl(image?: string) {
    if (!image) return "https://i.pravatar.cc/70";
    const filename = image.split("/").pop();
    return image.includes("/api/v1/files/") ? `/api/proxy/${filename}` : image;
  }

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setAllUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch (err) {
      console.error("Erro ao deletar usuário", err);
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1
            className={`text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Usuários
          </h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span
                className={`absolute left-3 top-2.5 ${
                  isLight ? "text-gray-400" : "text-gray-300"
                }`}
              >
                <Search size={16} />
              </span>
              <input
                className={`pl-9 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 ${
                  isLight
                    ? "border border-gray-300 focus:ring-blue-500 bg-white text-gray-900"
                    : "border border-gray-600 bg-gray-800 text-white focus:ring-blue-400 placeholder-gray-400"
                }`}
                placeholder="Buscar Usuário..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                type="text"
              />
            </div>
            <Button
              size="sm"
              className="py-2"
              onClick={() => setShowModal(true)}
            >
              +<span className="hidden md:inline ml-1">Novo Usuário</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map((user: any) => (
            <div
              key={user.id}
              className={`rounded-md border shadow-md p-4 flex justify-between items-center transition gap-4 ${
                isLight
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-gray-900 border-gray-700 text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={resolveImageUrl(
                    user?.avatar || "https://i.pravatar.cc/70"
                  )}
                  alt={user.name}
                  className="w-12 h-12 object-cover rounded-full border"
                />
                <div>
                  <div
                    className="font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: highlight(user.name),
                    }}
                  />
                  <div
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: highlight(user.email),
                    }}
                  />
                  <div className="text-xs text-gray-400">{user.role}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setUserToEdit(user)}>
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setUserToDelete(user)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {Math.ceil(allUsers.length / limit) > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from(
              { length: Math.ceil(allUsers.length / limit) },
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

        {(showModal || userToEdit) && (
          <UserModal
            user={userToEdit}
            onClose={() => {
              setShowModal(false);
              setUserToEdit(null);
            }}
            onUserSaved={(saved) => {
              setShowModal(false);
              setUserToEdit(null);
              setAllUsers((prev) => {
                const exists = prev.find((u) => u.id === saved.id);
                return exists
                  ? prev.map((u) => (u.id === saved.id ? saved : u))
                  : [saved, ...prev];
              });
            }}
          />
        )}

        {userToDelete && (
          <ConfirmModal
            open={!!userToDelete}
            title="Remover Usuário"
            description={`Deseja remover o usuário '${userToDelete.name}'?`}
            onCancel={() => setUserToDelete(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
