import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  getProductColumns,
  DeleteProductDialog,
} from "~/features/dashboard/products"
import {
  useProducts,
  useProductCategories,
  useProductDelete,
} from "~/features/dashboard/products/hooks"
import { ProductsTableArea } from "./components/ProductsTableArea"

const LIMIT = 10

export default function ProductsPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "")
  const prevSearchInputRef = useRef(searchInput)

  const page = Number(searchParams.get("page") ?? "1")
  const q = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? ""
  const skip = (page - 1) * LIMIT

  useEffect(() => {
    if (prevSearchInputRef.current === searchInput) return
    prevSearchInputRef.current = searchInput

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (searchInput) {
          next.set("q", searchInput)
        } else {
          next.delete("q")
        }
        next.set("page", "1")
        return next
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, setSearchParams])

  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts({
    limit: LIMIT,
    skip,
    q: q || undefined,
    category: category || undefined,
  })

  const { data: categoriesData } = useProductCategories()
  const categories = categoriesData ?? []

  const {
    deleteTarget,
    open: deleteDialogOpen,
    error: deleteError,
    isPending: isDeletePending,
    handleDeleteClick,
    handleConfirm: handleDeleteConfirm,
    handleClose: handleDeleteClose,
  } = useProductDelete()

  const totalPages = Math.ceil((productsData?.total ?? 0) / LIMIT)

  const columns = useMemo(
    () => getProductColumns(handleDeleteClick),
    [handleDeleteClick]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground">
          Manage your product inventory
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={category || "all"}
          onValueChange={(value) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev)
              if (value === "all") {
                next.delete("category")
              } else {
                next.set("category", value as string)
              }
              next.set("page", "1")
              return next
            })
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table area */}
      <ProductsTableArea
        isLoading={isLoading}
        isError={isError}
        columns={columns}
        productsData={productsData}
        totalPages={totalPages}
        page={page}
        setSearchParams={setSearchParams}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => { if (!open) handleDeleteClose() }}
        onConfirm={handleDeleteConfirm}
        isPending={isDeletePending}
        productTitle={deleteTarget?.title}
        error={deleteError}
      />
    </div>
  )
}
