# Listing Page Patterns

## Delete State

Never use separate `isOpen` + `target` + `error` states for a delete flow. Use a single nullable target: `null` means closed, non-null means open. Extract all delete orchestration into a dedicated hook.

```ts
// ✅ correct — one state drives everything
const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null)
const open = deleteTarget !== null

// ❌ wrong — three separate states
const [deleteTarget, setDeleteTarget] = useState<...>(null)
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
const [deleteError, setDeleteError] = useState<string | null>(null)
```

## Extract Delete Orchestration into a Hook

When a page has a delete confirmation flow, extract the state + mutation + error handling into a `use<Feature>Delete` hook in the feature's `hooks/` folder. The hook owns `deleteTarget`, `error`, `isPending`, and exposes `handleDeleteClick(id, title)`, `handleConfirm()`, `handleClose()`.

The `DeleteDialog` component accepts an `error` prop and renders it inside the dialog — error display is co-located with the action, not scattered at the page level.

```ts
// hooks/useProductDelete.ts
export function useProductDelete() {
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mutation = useDeleteProduct()
  // ...
  return { deleteTarget, open: deleteTarget !== null, error, isPending: mutation.isPending,
           handleDeleteClick, handleConfirm, handleClose }
}
```

## Memoize Column Definitions

Always wrap `getColumns(...)` in `useMemo` so the column array reference is stable across renders.

```ts
// ✅ correct
const columns = useMemo(() => getProductColumns(handleDeleteClick), [handleDeleteClick])

// ❌ wrong — new array on every render
const columns = getProductColumns(handleDeleteClick)
```

## Column Definitions Pass Full Context

Column `onDelete` (and similar callbacks) should receive all data needed from `row.original` directly — e.g., `onDelete(row.original.id, row.original.title)` — so the page/hook doesn't need to look up the item by id from query data.

## Shared Table States

Use `SkeletonTable` and `TableErrorState` from `~/components/shared/table-states` for loading and error states in any data table page. Do not inline skeleton/error UI inside route files.

```tsx
import { SkeletonTable, TableErrorState } from "~/components/shared/table-states"

if (isLoading) return <SkeletonTable rows={8} columns={8} />
if (isError) return <TableErrorState message="Failed to load products." />
```

## Search Debounce with URL Params

Keep a separate controlled `searchInput` local state for the input value. Sync it to the URL `q` param with a 300 ms debounce. Use a `useRef` to track the previous value so the `useEffect` only fires on actual user input — never on navigation-driven re-renders (which can change `setSearchParams` reference).

```ts
const prevSearchInputRef = useRef(searchInput)
useEffect(() => {
  if (prevSearchInputRef.current === searchInput) return
  prevSearchInputRef.current = searchInput
  const timer = setTimeout(() => { /* update URL */ }, 300)
  return () => clearTimeout(timer)
}, [searchInput, setSearchParams])
```

## One Component Per File

Extract helper components used only in a route file into their own component files. Do not define multiple components in the same file. Keeps routes focused on orchestration and allows components to be tested and reused independently.

```ts
// ✅ correct
// routes/dashboard/products.tsx — only the page component
// routes/dashboard/components/ProductsTableArea.tsx — the table component
// routes/dashboard/components/ProductsFilters.tsx — the filters component

// ❌ wrong — too many components in one file
// routes/dashboard/products.tsx — contains ProductsPage, TableArea, SkeletonTable, ErrorState, etc.
```
