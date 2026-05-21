import { Skeleton } from "~/components/ui/skeleton"

interface SkeletonTableProps {
  rows?: number
  columns?: number
}

function getSkeletonCellClass(colIdx: number, totalColumns: number): string {
  if (colIdx === 0) return "h-4 w-6 shrink-0"
  if (colIdx === 1) return "h-10 w-10 shrink-0 rounded"
  if (colIdx === totalColumns - 1) return "size-8 shrink-0 rounded-full"
  if (colIdx === totalColumns - 2) return "h-6 w-20 shrink-0 rounded-full"
  return "h-4 flex-1"
}

export function SkeletonTable({
  rows = 8,
  columns = 8,
}: Readonly<SkeletonTableProps>) {
  const rowKeys = Array.from({ length: rows }, (_, i) => `sk-row-${i}`)
  const colKeys = Array.from({ length: columns }, (_, i) => `sk-col-${i}`)

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="divide-y">
        {rowKeys.map((rowKey) => (
          <div key={rowKey} className="flex items-center gap-4 px-4 py-3">
            {colKeys.map((colKey, colIdx) => (
              <Skeleton
                key={colKey}
                className={getSkeletonCellClass(colIdx, columns)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface TableErrorStateProps {
  message?: string
}

export function TableErrorState({
  message = "Failed to load data. Please try again.",
}: Readonly<TableErrorStateProps>) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-md border border-dashed">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
