import type { ColumnDef } from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "~/components/ui/button"
import type { Product } from "../types"

const statusStyles: Record<string, string> = {
  "In Stock":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Low Stock":
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Out of Stock":
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function getProductColumns(
  onDelete: (id: number, title: string) => void
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "thumbnail",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.thumbnail}
          alt={row.original.title}
          className="h-10 w-10 rounded object-cover"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="block max-w-48 truncate font-medium">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span>${row.original.price.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => <span>{row.original.stock}</span>,
    },
    {
      accessorKey: "availabilityStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.availabilityStatus
        const style =
          statusStyles[status] ?? "bg-muted text-muted-foreground"
        return (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
          >
            {status}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(row.original.id, row.original.title)}
        >
          <HugeiconsIcon
            icon={Delete02Icon}
            strokeWidth={2}
            className="size-4"
          />
          <span className="sr-only">Delete {row.original.title}</span>
        </Button>
      ),
    },
  ]
}
