import type React from "react"
import { useSearchParams } from "react-router"
import { DataTable } from "~/components/shared/data-table"
import {
  SkeletonTable,
  TableErrorState,
} from "~/components/shared/table-states"
import { getProductColumns } from "~/features/dashboard/products"
import type { ProductsResponse } from "~/features/dashboard/products"

interface ProductsTableAreaProps {
  isLoading: boolean
  isError: boolean
  columns: ReturnType<typeof getProductColumns>
  productsData: ProductsResponse | undefined
  totalPages: number
  page: number
  setSearchParams: ReturnType<typeof useSearchParams>[1]
}

export function ProductsTableArea({
  isLoading,
  isError,
  columns,
  productsData,
  totalPages,
  page,
  setSearchParams,
}: Readonly<ProductsTableAreaProps>): React.JSX.Element {
  if (isLoading) return <SkeletonTable rows={8} columns={8} />

  if (isError)
    return (
      <TableErrorState message="Failed to load products. Please try again." />
    )

  return (
    <DataTable
      columns={columns}
      data={productsData?.products ?? []}
      pageCount={totalPages}
      pageIndex={page - 1}
      onPageChange={(idx) => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.set("page", String(idx + 1))
          return next
        })
      }}
    />
  )
}
