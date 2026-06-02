import { useQuery } from "@tanstack/react-query"
import type { UseQueryResult } from "@tanstack/react-query"
import { getProduct } from "../api"
import type { Product } from "../types"

export const useProduct = (id: number): UseQueryResult<Product, Error> =>
  useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
