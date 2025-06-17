import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/products";
import type { ProductType } from "@/types/product";

export function useProducts({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;

  const { data, error, isLoading, isFetching, refetch, isError } = useQuery<
    ProductType[],
    Error
  >({
    queryKey: ["products", page],
    queryFn: () => getProducts(offset, limit),
    placeholderData: (previousData) => previousData,
  });

  return {
    products: data || [],
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
