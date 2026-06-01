# Extract Hook — Patterns & Examples

Use when: logic is reusable across components, or state/effects are tangled with JSX.

---

## Pattern A — Filter / Sort / Derived State

Move data transformation out of the component body.

**Before:**

```tsx
function ProductsList() {
  const { data: products } = useProducts()
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  const filtered = products
    ?.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) =>
      sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price
    )

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filtered?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

**After:**

```tsx
// hooks/useProductFiltering.ts
export function useProductFiltering(products: Product[]) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  const filtered = useMemo(() =>
    products
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) =>
        sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price
      ),
    [products, filter, sortBy]
  )

  return { filtered, filter, setFilter, sortBy, setSortBy }
}

// ProductsList.tsx
function ProductsList() {
  const { data: products = [] } = useProducts()
  const { filtered, filter, setFilter } = useProductFiltering(products)

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filtered.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

---

## Pattern B — Toggle / Modal / UI State

Isolate boolean UI state that has no business logic in it.

**Before:**

```tsx
function ProductCard({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Details</button>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          {isConfirming
            ? <ConfirmDelete onCancel={() => setIsConfirming(false)} />
            : <button onClick={() => setIsConfirming(true)}>Delete</button>
          }
        </Modal>
      )}
    </>
  )
}
```

**After:**

```tsx
// hooks/useDisclosure.ts
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(v => !v),
  }
}

// ProductCard.tsx
function ProductCard({ product }: { product: Product }) {
  const modal = useDisclosure()
  const confirm = useDisclosure()

  return (
    <>
      <button onClick={modal.open}>Details</button>
      {modal.isOpen && (
        <Modal onClose={modal.close}>
          {confirm.isOpen
            ? <ConfirmDelete onCancel={confirm.close} />
            : <button onClick={confirm.open}>Delete</button>
          }
        </Modal>
      )}
    </>
  )
}
```

---

## Pattern C — Async Action with Loading/Error State

Wrap a one-off async operation that doesn't belong in React Query.

**Before:**

```tsx
function ExportButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.exportData()
    } catch (e) {
      setError('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={handleExport} disabled={loading}>
        {loading ? 'Exporting…' : 'Export'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  )
}
```

**After:**

```tsx
// hooks/useAsync.ts
export function useAsync<T>(fn: () => Promise<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async () => {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading, error }
}

// ExportButton.tsx
function ExportButton() {
  const { execute, loading, error } = useAsync(() => api.exportData())

  return (
    <>
      <Button onClick={execute} disabled={loading}>
        {loading ? 'Exporting…' : 'Export'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  )
}
```

---

## Checklist

- [ ] Hook name starts with `use`
- [ ] Returns a stable object (use `useMemo` on return value if passed to deps)
- [ ] No JSX inside the hook
- [ ] Tested independently from the component
- [ ] Placed in `app/features/[feature]/hooks/` or `app/hooks/` if shared
