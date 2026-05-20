# Memoization — Patterns & Examples

Use when: a component re-renders too often, receives stable props, or has expensive computations.

> **Rule:** Measure first. Add memoization only when you can observe the problem — premature
> memoization adds complexity without benefit and can introduce bugs.

---

## When to Memoize

| Signal                                                                    | Tool                   |
| ------------------------------------------------------------------------- | ---------------------- |
| Component re-renders when parent re-renders but its props haven't changed | `React.memo`           |
| Expensive calculation (sort/filter/transform) runs every render           | `useMemo`              |
| Callback re-created every render, passed to a memoised child              | `useCallback`          |
| Component receives an object/array literal as a prop                      | `useMemo` on the value |

---

## Pattern A — React.memo

Wrap a component to skip re-renders when props are shallowly equal.

**Before — re-renders on every parent render:**

```tsx
function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <h3>{user.name}</h3>
      <Button onClick={() => onEdit(user.id)}>Edit</Button>
    </Card>
  )
}

// Parent re-renders → every UserCard re-renders even if user hasn't changed
function UserList() {
  const [search, setSearch] = useState('')
  const { data: users } = useUsers()

  return (
    <>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {users?.map(user => <UserCard key={user.id} user={user} onEdit={handleEdit} />)}
    </>
  )
}
```

**After:**

```tsx
// Memoised — skips re-render if user and onEdit refs are stable
export const UserCard = memo(function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <h3>{user.name}</h3>
      <Button onClick={() => onEdit(user.id)}>Edit</Button>
    </Card>
  )
})

// Parent must stabilise the callback too — see Pattern C
function UserList() {
  const [search, setSearch] = useState('')
  const { data: users } = useUsers()
  const handleEdit = useCallback((id: string) => { /* ... */ }, [])

  return (
    <>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {users?.map(user => <UserCard key={user.id} user={user} onEdit={handleEdit} />)}
    </>
  )
}
```

---

## Pattern B — useMemo for Expensive Computations

Prevent recalculating derived data on every render.

**Before — runs on every render:**

```tsx
function ProductsList() {
  const { data: products = [] } = useProducts()
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  // Recalculates every render, even when filter/sortBy haven't changed
  const processed = products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => sortBy === 'name'
      ? a.name.localeCompare(b.name)
      : a.price - b.price
    )

  return <ProductsGrid products={processed} />
}
```

**After:**

```tsx
function ProductsList() {
  const { data: products = [] } = useProducts()
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  // Only recalculates when products, filter, or sortBy change
  const processed = useMemo(() =>
    products
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : a.price - b.price
      ),
    [products, filter, sortBy]
  )

  return <ProductsGrid products={processed} />
}
```

---

## Pattern C — useCallback for Stable Callbacks

Stabilise a function reference so memoised children don't re-render.

**Before — new function reference every render:**

```tsx
function Parent() {
  const [count, setCount] = useState(0)

  // New reference on every render → breaks memo on Child
  const handleAction = (id: string) => {
    console.log('action', id)
  }

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Re-render parent</button>
      <MemoizedChild onAction={handleAction} />
    </>
  )
}
```

**After:**

```tsx
function Parent() {
  const [count, setCount] = useState(0)

  // Stable reference — Child won't re-render when count changes
  const handleAction = useCallback((id: string) => {
    console.log('action', id)
  }, []) // add deps if the function closes over changing values

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Re-render parent</button>
      <MemoizedChild onAction={handleAction} />
    </>
  )
}
```

---

## Pattern D — Stabilise Object Props

Object/array literals create a new reference every render, breaking `React.memo`.

**Before — new object every render:**

```tsx
function Parent() {
  const [name, setName] = useState('')

  // New object on every render → MemoizedChild always re-renders
  return <MemoizedChild config={{ theme: 'dark', size: 'lg' }} />
}
```

**After:**

```tsx
// Option 1: Move static objects outside the component
const CONFIG = { theme: 'dark', size: 'lg' } as const

function Parent() {
  return <MemoizedChild config={CONFIG} />
}

// Option 2: useMemo for dynamic objects
function Parent({ theme }: { theme: string }) {
  const config = useMemo(() => ({ theme, size: 'lg' }), [theme])
  return <MemoizedChild config={config} />
}
```

---

## Common Mistakes

| Mistake                                                  | Problem                                   | Fix                               |
| -------------------------------------------------------- | ----------------------------------------- | --------------------------------- |
| `React.memo` without `useCallback` on callbacks          | Memo never fires — callback is always new | Wrap callback in `useCallback`    |
| Empty `useCallback` deps array closing over stale values | Stale closure bugs                        | Add all referenced values to deps |
| `useMemo` with no deps `[]`                              | Computes once but never updates           | Add the correct deps              |
| Memoizing everything by default                          | Overhead with no benefit                  | Profile first, memoize second     |

---

## Checklist

- [ ] Verified the re-render problem exists (React DevTools Profiler)
- [ ] `React.memo` component has all prop callbacks stabilised with `useCallback`
- [ ] All `useMemo` / `useCallback` dep arrays are correct and complete
- [ ] Static objects/arrays moved outside the component where possible
- [ ] Re-tested after memoization — no stale data bugs introduced
