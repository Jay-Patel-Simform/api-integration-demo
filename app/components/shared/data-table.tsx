import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Optional server-side pagination
  pageCount?: number
  pageIndex?: number
  onPageChange?: (pageIndex: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageIndex = 0,
  onPageChange,
}: Readonly<DataTableProps<TData, TValue>>) {
  const isServerPagination = pageCount !== undefined

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(isServerPagination
      ? {
          manualPagination: true,
          pageCount,
          state: {
            pagination: {
              pageIndex,
              pageSize: 10,
            },
          },
          onPaginationChange: (updater) => {
            const newPaginationState = typeof updater === 'function'
              ? updater({ pageIndex, pageSize: 10 })
              : updater
            onPageChange?.(newPaginationState.pageIndex)
          },
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),
  })

  const canPrevious = isServerPagination
    ? pageIndex > 0
    : table.getCanPreviousPage()
  const canNext = isServerPagination
    ? pageIndex < (pageCount ?? 1) - 1
    : table.getCanNextPage()

  const handlePrevious = () => {
    if (isServerPagination) {
      onPageChange?.(pageIndex - 1)
    } else {
      table.previousPage()
    }
  }

  const handleNext = () => {
    if (isServerPagination) {
      onPageChange?.(pageIndex + 1)
    } else {
      table.nextPage()
    }
  }

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!canPrevious}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!canNext}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
