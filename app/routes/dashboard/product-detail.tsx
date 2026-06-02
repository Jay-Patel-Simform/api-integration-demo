import type React from "react"
import { useParams } from "react-router"
import axios from "axios"

import {
  ProductDetail,
  ProductDetailSkeleton,
  ProductDetailError,
} from "~/features/dashboard/products/components/ProductDetail"
import { useProduct } from "~/features/dashboard/products"

export default function ProductDetailPage(): React.JSX.Element {
  const { id } = useParams()
  const numericId = Number(id)
  const { data: product, isLoading, isError, error } = useProduct(numericId)

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (isError || !product) {
    const errorMessage = axios.isAxiosError(error)
      ? ((error.response?.data as { message?: string } | undefined)?.message ??
        "Failed to load product.")
      : "Failed to load product."
    return <ProductDetailError message={errorMessage} />
  }

  return <ProductDetail product={product} />
}
