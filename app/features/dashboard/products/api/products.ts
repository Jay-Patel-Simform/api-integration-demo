import { apiClient } from "~/lib/api"
import type {
  Product,
  ProductCategory,
  ProductsParams,
  ProductsResponse,
} from "../types"

export const getProducts = async (
  params: ProductsParams
): Promise<ProductsResponse> => {
  const { limit = 10, skip = 0, q, category } = params

  if (q) {
    const res = await apiClient.get<ProductsResponse>("/products/search", {
      params: { q, limit, skip },
    })
    return res.data
  }

  if (category) {
    const res = await apiClient.get<ProductsResponse>(
      `/products/category/${category}`,
      {
        params: { limit, skip },
      }
    )
    return res.data
  }

  const res = await apiClient.get<ProductsResponse>("/products", {
    params: { limit, skip },
  })
  return res.data
}

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const res = await apiClient.get<ProductCategory[]>("/products/categories")
  return res.data
}

export const deleteProduct = async (id: number): Promise<Product> => {
  const res = await apiClient.delete<Product>(`/products/${id}`)
  return res.data
}

export const getProduct = async (id: number): Promise<Product> => {
  const res = await apiClient.get<Product>(`/products/${id}`)
  return res.data
}
