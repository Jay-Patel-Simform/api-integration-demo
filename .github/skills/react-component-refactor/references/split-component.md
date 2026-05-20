# Split Component — Patterns & Examples

Use when: a component is too large, mixes concerns, or contains self-contained JSX blocks.

---

## Pattern A — Presentational Component

Extract pure UI that only receives props and renders. No data fetching, no side effects.

**Before:**

```tsx
function Dashboard() {
  const { data: users } = useUsers()

  return (
    <div>
      {users?.map(user => (
        <div key={user.id} className="card">
          <img src={user.avatar} alt={user.name} />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={() => editUser(user.id)}>Edit</button>
        </div>
      ))}
    </div>
  )
}
```

**After:**

```tsx
// app/features/users/components/UserCard.tsx
interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}

/** Displays a user in card format with an edit action. */
export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card className="p-4">
      <img src={user.avatar} alt={user.name} />
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>
      <Button size="sm" onClick={() => onEdit(user.id)}>Edit</Button>
    </Card>
  )
}

// Dashboard.tsx
function Dashboard() {
  const { data: users } = useUsers()
  return (
    <div>
      {users?.map(user => (
        <UserCard key={user.id} user={user} onEdit={editUser} />
      ))}
    </div>
  )
}
```

---

## Pattern B — Container / Presentational Split

Separate data fetching (container) from rendering (presentational).

**Before:**

```tsx
function ProductProfile({ productId }: { productId: string }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/products/${productId}`)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) return <Spinner />

  return (
    <div>
      <ProductHeader product={product} />
      <ProductBody product={product} />
    </div>
  )
}
```

**After:**

```tsx
// Container — owns data via React Query
function ProductProfileContainer({ productId }: { productId: string }) {
  const { data: product, isLoading, error } = useProduct({ productId })

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  if (!product) return <EmptyState message="Product not found" />

  return <ProductProfile product={product} />
}

// Presentational — pure render
function ProductProfile({ product }: { product: Product }) {
  return (
    <div>
      <ProductHeader product={product} />
      <ProductBody product={product} />
    </div>
  )
}
```

---

## Pattern C — Split Form Sections

Break a monolithic form into named section components.

**Before:**

```tsx
function UserForm() {
  return (
    <form>
      {/* 200+ lines of mixed fields */}
    </form>
  )
}
```

**After:**

```tsx
// UserForm.tsx — orchestrates sections
function UserForm() {
  const form = useForm<UserFormData>({ resolver: zodResolver(userSchema) })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PersonalInfoSection />
        <AddressSection />
        <PreferencesSection />
        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  )
}

// Each section uses useFormContext() — no prop drilling
function PersonalInfoSection() {
  const { register, formState: { errors } } = useFormContext<UserFormData>()
  return (
    <section>
      <h2>Personal Info</h2>
      <input {...register('firstName')} />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      {/* other fields */}
    </section>
  )
}
```

---

## Checklist

- [ ] New component has a single clear responsibility
- [ ] Props typed with a TypeScript interface
- [ ] JSDoc added to exported component
- [ ] Exported from `index.ts`
- [ ] Parent removes all extracted JSX and unused state/imports
