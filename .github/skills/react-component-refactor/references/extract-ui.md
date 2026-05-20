# Extract UI — Patterns & Examples

Use when: a UI pattern is duplicated across 2+ components, or a layout shell is repeated.

---

## Pattern A — Shared Data State (Loading / Error / Empty)

The most commonly duplicated pattern in React apps.

**Before — copy-pasted in every list:**

```tsx
function ProductsList() {
  const { data, isLoading, error } = useProducts()
  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>
  if (!data?.length) return <div className="text-gray-500">No products</div>
  return <div>{data.map(p => <ProductCard key={p.id} product={p} />)}</div>
}

function OrdersList() {
  const { data, isLoading, error } = useOrders()
  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>
  if (!data?.length) return <div className="text-gray-500">No orders</div>
  return <div>{data.map(o => <OrderCard key={o.id} order={o} />)}</div>
}
```

**After — one reusable component in `app/components/shared/`:**

```tsx
// app/components/shared/DataDisplay.tsx
interface DataDisplayProps<T> {
  data: T[] | undefined
  isLoading: boolean
  error: Error | null
  emptyMessage: string
  children: (data: T[]) => React.ReactNode
}

export function DataDisplay<T>({
  data, isLoading, error, emptyMessage, children
}: DataDisplayProps<T>) {
  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>
  if (!data?.length) return <div className="text-gray-500">{emptyMessage}</div>
  return <>{children(data)}</>
}

// Now both lists are clean
function ProductsList() {
  const { data, isLoading, error } = useProducts()
  return (
    <DataDisplay data={data} isLoading={isLoading} error={error} emptyMessage="No products">
      {products => products.map(p => <ProductCard key={p.id} product={p} />)}
    </DataDisplay>
  )
}
```

---

## Pattern B — Layout Component

Extract a repeated structural shell into a slot-based layout.

**Before — layout copy-pasted across pages:**

```tsx
function DashboardPage() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-50">
        {/* sidebar */}
      </div>
      <div className="flex-1 overflow-auto p-6">
        {/* main */}
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-50">
        {/* same sidebar */}
      </div>
      <div className="flex-1 overflow-auto p-6">
        {/* different main */}
      </div>
    </div>
  )
}
```

**After:**

```tsx
// app/components/layouts/SidebarLayout.tsx
interface SidebarLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-50">{sidebar}</div>
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  )
}

// Usage
function DashboardPage() {
  return (
    <SidebarLayout sidebar={<DashboardSidebar />}>
      <DashboardContent />
    </SidebarLayout>
  )
}
```

---

## Pattern C — Conditional Render Wrapper

Eliminate repeated guard clauses for permissions, feature flags, or auth.

**Before:**

```tsx
function AdminPanel() {
  const { user } = useAuth()
  if (!user?.isAdmin) return null
  return <Panel />
}

function AdminButton() {
  const { user } = useAuth()
  if (!user?.isAdmin) return null
  return <Button>Admin Action</Button>
}
```

**After:**

```tsx
// app/components/shared/AdminOnly.tsx
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user?.isAdmin) return null
  return <>{children}</>
}

// Usage — no repeated guard logic
function AdminPanel() {
  return <AdminOnly><Panel /></AdminOnly>
}

function AdminButton() {
  return <AdminOnly><Button>Admin Action</Button></AdminOnly>
}
```

---

## Where to Place Shared UI

| Scope                                      | Location                             |
| ------------------------------------------ | ------------------------------------ |
| Used across 2+ features                    | `app/components/shared/`             |
| Layout / page shell                        | `app/components/layouts/`            |
| Feature-specific but shared within feature | `app/features/[feature]/components/` |

---

## Checklist

- [ ] Component placed in the right location (see table above)
- [ ] Generic enough to work with different data types (use generics where needed)
- [ ] Props are minimal — only what varies between usages
- [ ] Exported and added to `app/components/shared/index.ts` if shared
- [ ] Original duplicated code removed from all callers
