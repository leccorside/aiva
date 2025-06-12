import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/products";
import type { ProductType } from "@/types/product";

export function useProducts(page: number) {
  const limit = 10;
  const offset = (page - 1) * limit;

  const productsQuery = useQuery<ProductType[], Error>({
    queryKey: ["products", page],
    queryFn: () => getProducts(offset, limit),
    placeholderData: (previousData) => previousData, // ✅ substitui keepPreviousData
  });

  return {
    ...productsQuery,
    products: productsQuery.data || [],
  };
}
