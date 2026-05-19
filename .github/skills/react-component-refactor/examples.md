# Real-World Refactoring Examples

Examples aligned with this project's **React Query + bulletproof-react** architecture.

## Example 1: Refactoring ProductsList Component

### Before: Monolithic Component (300+ lines)

```tsx
// app/routes/products.tsx - Too many responsibilities
function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Mixed concerns: data fetching + API calls
  useEffect(() => {
    api.get('/products')
      .then(data => setProducts(data.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])

  // Business logic mixed with rendering
  const filtered = products
    .filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.description?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return a.price - b.price
    })

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setError(err as Error)
    }
  }

  if (loading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>

  return (
    <div className="space-y-4">
      {/* 50+ lines of filter/search UI */}
      <div className="flex gap-2">
        <Input
          placeholder="Search products..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </Select>
      </div>

      {/* 100+ lines of grid/list rendering */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <div className="flex gap-2 mt-4">
              <Link to={`/product/${product.id}`}>
                <Button variant="outline" size="sm">View</Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeleteId(product.id)
                  setIsDeleteDialogOpen(true)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog logic */}
      {isDeleteDialogOpen && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          {/* ... dialog content ... */}
        </AlertDialog>
      )}
    </div>
  )
}
```

### After: Refactored with Extracted Components

**Step 1: Extract filter/sort to custom hook**

```tsx
// app/hooks/useProductFilters.ts
import { useState, useMemo } from 'react'
import { Product } from '@/types/api'

export function useProductFilters(products: Product[] = []) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  const filtered = useMemo(() =>
    products
      .filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.description?.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return a.price - b.price
      }),
    [products, filter, sortBy]
  )

  return { filter, setFilter, sortBy, setSortBy, filtered }
}
```

**Step 2: Extract product card component**

```tsx
// app/features/products/components/ProductCard.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router'
import { Product } from '@/types/api'

interface ProductCardProps {
  product: Product
  onDelete?: (id: string) => void
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      <p className="text-lg font-bold mt-2">${product.price}</p>
      <div className="flex gap-2 mt-4">
        <Link to={`/product/${product.id}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(product.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}
```

**Step 3: Extract filter controls**

```tsx
// app/features/products/components/ProductsFilters.tsx
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ProductsFiltersProps {
  filter: string
  onFilterChange: (filter: string) => void
  sortBy: 'name' | 'price'
  onSortChange: (sort: 'name' | 'price') => void
}

export function ProductsFilters({
  filter,
  onFilterChange,
  sortBy,
  onSortChange
}: ProductsFiltersProps) {
  return (
    <div className="flex gap-2 mb-6">
      <Input
        placeholder="Search products..."
        value={filter}
        onChange={e => onFilterChange(e.target.value)}
      />
      <select
        value={sortBy}
        onChange={e => onSortChange(e.target.value as 'name' | 'price')}
        className="px-3 py-2 border rounded-md"
      >
        <option value="name">Sort: Name</option>
        <option value="price">Sort: Price</option>
      </select>
    </div>
  )
}
```

**Step 4: Extract delete dialog**

```tsx
// app/features/products/components/DeleteProductDialog.tsx
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteProductDialogProps {
  productId: string | null
  isOpen: boolean
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteProductDialog({
  productId,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel
}: DeleteProductDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialog.Content>
        <AlertDialog.Header>Delete Product?</AlertDialog.Header>
        <AlertDialog.Description>
          This action cannot be undone.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
```

**Step 5: Clean main component using React Query**

```tsx
// app/features/products/components/ProductsList.tsx (refactored)
import { useState } from 'react'
import { useProducts } from '@/features/products/api/get-products'
import { useDeleteProduct } from '@/features/products/api/delete-product'
import { useProductFilters } from '@/hooks/useProductFilters'
import { Spinner } from '@/components/ui/spinner'
import { ProductCard } from './ProductCard'
import { ProductsFilters } from './ProductsFilters'
import { DeleteProductDialog } from './DeleteProductDialog'

export function ProductsList() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // React Query for data management
  const { data: products, isLoading, error } = useProducts()
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct({
    mutationConfig: {
      onSuccess: () => setDeleteId(null)
    }
  })

  // Custom hook for filter/sort logic
  const { filter, setFilter, sortBy, setSortBy, filtered } =
    useProductFilters(products?.data || [])

  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>

  return (
    <div className="space-y-4">
      <ProductsFilters
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={() => setDeleteId(product.id)}
          />
        ))}
      </div>

      <DeleteProductDialog
        productId={deleteId}
        isOpen={!!deleteId}
        isDeleting={isDeleting}
        onConfirm={() => deleteId && deleteProduct({ id: deleteId })}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
```

**Step 6: Simplify route**

```tsx
// app/routes/products.tsx (after refactoring)
import { ProductsList } from '@/features/products/components/products-list'

export default function ProductsPage() {
  return <ProductsList />
}
```

### Summary of Improvements

| Aspect               | Before                                   | After                                    |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| Main component lines | 300+                                     | 50                                       |
| Responsibilities     | 5+ (fetch, filter, sort, delete, render) | 1 (orchestrate)                          |
| Reusability          | Low (coupled)                            | High (ProductCard, Filters, Dialog)      |
| Testability          | Difficult                                | Easy (each component has single concern) |
| Data management      | useState + useEffect                     | React Query hooks                        |
| State logic          | Mixed with rendering                     | Custom hook                              |
| UI components        | Inline JSX                               | Extracted components                     |

const handleUserClick = (user: User) => {
setSelectedUser(user)
}

const handleUserEdit = async (userId: string, updates: Partial<User>) => {
try {
const response = await fetch(`/api/users/${userId}`, {
method: 'PATCH',
body: JSON.stringify(updates)
})
const updatedUser = await response.json()
setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u))
setSelectedUser(updatedUser)
} catch (err) {
console.error('Failed to update user:', err)
}
}

const handleUserDelete = async (userId: string) => {
if (!confirm('Are you sure?')) return

    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      setUsers(prev => prev.filter(u => u.id !== userId))
      setSelectedUser(null)
    } catch (err) {
      console.error('Failed to delete user:', err)
    }

}

// Render logic (220 lines)
if (loading) {
return (

<div className="dashboard loading">
<div className="spinner">Loading...</div>
</div>
)
}

if (error) {
return (

<div className="dashboard error">
<div className="error-message">
<h2>Error Loading Dashboard</h2>
<p>{error.message}</p>
<button onClick={() => window.location.reload()}>Retry</button>
</div>
</div>
)
}

return (

<div className="dashboard">
{/_ Header with stats (50 lines) _/}
<div className="dashboard-header">
<h1>Dashboard</h1>
{stats && (
<div className="stats-grid">
<div className="stat-card">
<div className="stat-icon">👥</div>
<div className="stat-content">
<div className="stat-label">Total Users</div>
<div className="stat-value">{stats.totalUsers}</div>
</div>
</div>
<div className="stat-card">
<div className="stat-icon">✅</div>
<div className="stat-content">
<div className="stat-label">Active Users</div>
<div className="stat-value">{stats.activeUsers}</div>
</div>
</div>
<div className="stat-card">
<div className="stat-icon">📈</div>
<div className="stat-content">
<div className="stat-label">Growth Rate</div>
<div className="stat-value">{stats.growthRate}%</div>
</div>
</div>
</div>
)}
</div>

      {/* Filters and controls (40 lines) */}
      <div className="dashboard-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'email')}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      {/* User list (80 lines) */}
      <div className="dashboard-content">
        <div className="user-list">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <p>No users found matching your criteria</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <div className="user-meta">
                    <span className={`status ${user.status}`}>
                      {user.status}
                    </span>
                    <span className="joined">
                      Joined {new Date(user.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected user details (50 lines) */}
        {selectedUser && (
          <div className="user-details">
            <div className="details-header">
              <h2>User Details</h2>
              <button onClick={() => setSelectedUser(null)}>Close</button>
            </div>
            <div className="details-body">
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedUser.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span>{selectedUser.status}</span>
              </div>
              <div className="detail-row">
                <label>Role:</label>
                <span>{selectedUser.role}</span>
              </div>
              <div className="detail-row">
                <label>Joined:</label>
                <span>{new Date(selectedUser.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="details-actions">
              <button
                onClick={() => handleUserEdit(selectedUser.id, {})}
                className="btn-primary"
              >
                Edit
              </button>
              <button
                onClick={() => handleUserDelete(selectedUser.id)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

)
}

````

### After: Refactored Dashboard (60 lines main + 8 sub-components)

```tsx
// Dashboard.tsx (60 lines)
export function Dashboard() {
  const { users, stats, loading, error, refetch } = useDashboardData()
  const { selectedUser, setSelectedUser } = useSelectedUser()

  if (loading) return <DashboardLoading />
  if (error) return <DashboardError error={error} onRetry={refetch} />

  return (
    <div className="dashboard">
      <DashboardHeader stats={stats} />
      <DashboardContent
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
    </div>
  )
}

// hooks/useDashboardData.ts (40 lines)
export function useDashboardData() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [usersData, statsData] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/stats').then(r => r.json())
      ])
      setUsers(usersData)
      setStats(statsData)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { users, stats, loading, error, refetch: fetchData }
}

// hooks/useSelectedUser.ts (15 lines)
export function useSelectedUser() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  return { selectedUser, setSelectedUser }
}

// DashboardHeader.tsx (30 lines)
interface DashboardHeaderProps {
  stats: Stats | null
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  return (
    <div className="dashboard-header">
      <h1>Dashboard</h1>
      {stats && <StatsGrid stats={stats} />}
    </div>
  )
}

// StatsGrid.tsx (35 lines)
interface StatsGridProps {
  stats: Stats
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats-grid">
      <StatCard icon="👥" label="Total Users" value={stats.totalUsers} />
      <StatCard icon="✅" label="Active Users" value={stats.activeUsers} />
      <StatCard icon="📈" label="Growth Rate" value={`${stats.growthRate}%`} />
    </div>
  )
}

// StatCard.tsx (20 lines)
interface StatCardProps {
  icon: string
  label: string
  value: string | number
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )
}

// DashboardContent.tsx (35 lines)
interface DashboardContentProps {
  users: User[]
  selectedUser: User | null
  onSelectUser: (user: User | null) => void
}

export function DashboardContent({
  users,
  selectedUser,
  onSelectUser
}: DashboardContentProps) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'email'>('name')

  const filteredUsers = useFilteredUsers(users, filter, sortBy)

  return (
    <>
      <DashboardControls
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="dashboard-content">
        <UserList
          users={filteredUsers}
          selectedUserId={selectedUser?.id}
          onSelectUser={onSelectUser}
        />
        {selectedUser && (
          <UserDetails
            user={selectedUser}
            onClose={() => onSelectUser(null)}
          />
        )}
      </div>
    </>
  )
}

// UserList.tsx (30 lines)
interface UserListProps {
  users: User[]
  selectedUserId?: string
  onSelectUser: (user: User) => void
}

export function UserList({
  users,
  selectedUserId,
  onSelectUser
}: UserListProps) {
  if (users.length === 0) {
    return <EmptyState message="No users found matching your criteria" />
  }

  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          isSelected={user.id === selectedUserId}
          onClick={() => onSelectUser(user)}
        />
      ))}
    </div>
  )
}

// UserCard.tsx (35 lines)
interface UserCardProps {
  user: User
  isSelected: boolean
  onClick: () => void
}

export function UserCard({ user, isSelected, onClick }: UserCardProps) {
  return (
    <div
      className={`user-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <img
        src={user.avatar}
        alt={user.name}
        className="user-avatar"
      />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <UserMeta user={user} />
      </div>
    </div>
  )
}
````

### Benefits After Refactoring

**Code Organization:**

- Main Dashboard component reduced from 450 → 60 lines (87% reduction)
- 8 focused, reusable components
- Clear separation of concerns

**Reusability:**

- `StatCard` - Used in other dashboards
- `UserCard` - Used in user selection dialogs
- `useDashboardData` - Pattern for other data hooks

**Testability:**

- Each component independently testable
- Hooks can be tested in isolation
- Easy to mock data fetching

**Maintainability:**

- Changes to UI don't affect data logic
- Changes to one section don't risk breaking others
- New developers can understand individual pieces

## Example 2: Complex Form Component

### Before: Monolithic Form (320 lines)

```tsx
function UserRegistrationForm() {
  // All state in one place
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')
  const [hobbies, setHobbies] = useState<string[]>([])
  const [bio, setBio] = useState('')

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Async state
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Validation logic (80 lines)
  const validateField = (name: string, value: string) => {
    // Lots of validation logic
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, eval(field)) // Get current value
  }

  // Submit handler (40 lines)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic
  }

  // 200 lines of JSX with all form fields inline
  return (
    <form onSubmit={handleSubmit}>
      {/* Personal info section */}
      {/* Address section */}
      {/* Preferences section */}
    </form>
  )
}
```

### After: Sectioned Form (40 lines main + 3 section components)

```tsx
// UserRegistrationForm.tsx (40 lines)
export function UserRegistrationForm() {
  const { formData, errors, updateField, handleSubmit, submitting } =
    useRegistrationForm()

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <PersonalInfoSection
        data={formData.personal}
        errors={errors}
        onChange={updateField}
      />

      <AddressSection
        data={formData.address}
        errors={errors}
        onChange={updateField}
      />

      <PreferencesSection
        data={formData.preferences}
        errors={errors}
        onChange={updateField}
      />

      <FormActions submitting={submitting} />
    </form>
  )
}

// PersonalInfoSection.tsx (50 lines)
export function PersonalInfoSection({ data, errors, onChange }: SectionProps) {
  return (
    <fieldset className="form-section">
      <legend>Personal Information</legend>

      <FormField
        label="First Name"
        name="firstName"
        value={data.firstName}
        error={errors.firstName}
        onChange={onChange}
        required
      />

      <FormField
        label="Last Name"
        name="lastName"
        value={data.lastName}
        error={errors.lastName}
        onChange={onChange}
        required
      />

      {/* More fields */}
    </fieldset>
  )
}

// hooks/useRegistrationForm.ts (80 lines)
export function useRegistrationForm() {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const updateField = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }, [])

  // Validation and submit logic

  return { formData, errors, updateField, handleSubmit, submitting }
}
```

## Key Takeaways

1. **Start with the biggest pain points** - Extract what causes the most friction
2. **Work incrementally** - One extraction at a time, verify each
3. **Focus on boundaries** - Components with clear inputs/outputs
4. **Reusability emerges** - Good extractions naturally become reusable
5. **Test continuously** - Verify functionality after each step
