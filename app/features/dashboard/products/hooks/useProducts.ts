import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  deleteProduct,
  getProductCategories,
  getProducts,
} from "../api"
import type { Product, ProductCategory, ProductsParams, ProductsResponse } from "../types"

export const useProducts = (params: ProductsParams) =>
  useQuery<ProductsResponse, Error>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  })

export const useProductCategories = () =>
  useQuery<ProductCategory[], Error>({
    queryKey: ["product-categories"],
    queryFn: getProductCategories,
    staleTime: Infinity,
  })

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation<Product, Error, number>({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
