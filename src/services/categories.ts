import { API_BASE_URL } from "@/lib/api";

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  return res.json();
}
