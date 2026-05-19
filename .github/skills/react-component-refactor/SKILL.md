---
name: react-component-refactor
description: "Refactor complex React components into smaller, reusable components. Use when: component is too large (>300 lines), has multiple responsibilities, difficult to test, has nested JSX, duplicate logic, or poor performance. Analyzes component structure, identifies extraction opportunities, creates sub-components, and verifies functionality."
argument-hint: "Path to complex React component to refactor"
user-invocable: true
---

# React Component Refactoring

A systematic workflow for breaking down complex React components into smaller, more maintainable, and reusable pieces.

> **Note:** This project follows the **bulletproof-react** architecture with **React Query** for state management and **Zod** for validation. Examples below use these patterns.

## When to Use This Skill

### Complexity Indicators

Use this skill when a React component exhibits any of these signs:

**Size & Structure:**

- Over 300 lines of code
- More than 3 levels of JSX nesting
- Multiple return statements with duplicate JSX
- Long files that require excessive scrolling

**Responsibility:**

- Handles multiple concerns (data fetching + rendering + business logic)
- Mixes presentation and container logic
- Has tightly coupled UI and state management

**Maintainability:**

- Difficult to understand without extensive comments
- Hard to test in isolation
- Changes in one part break unrelated parts
- Team members avoid touching it

**Performance:**

- Re-renders too frequently
- Could benefit from React.memo but is too complex
- Expensive computations not isolated

**Reusability:**

- Contains patterns used elsewhere in the codebase
- Has UI elements that could be shared
- Business logic that could be extracted

## Refactoring Strategy

### Component Extraction Patterns

#### 1. Presentational Components

Extract pure UI components that only receive props and render:

```tsx
// Before: Inline card rendering
function Dashboard() {
  const [users, setUsers] = useState([])

  return (
    <div>
      {users.map(user => (
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

// After: Extracted presentational component
interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}

function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  )
}

function Dashboard() {
  const [users, setUsers] = useState([])

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onEdit={editUser} />
      ))}
    </div>
  )
}
```

#### 2. Container Components

Extract data fetching and state management logic using **React Query**:

````tsx
// Before: Mixed concerns
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

// After: Separated with React Query
function ProductProfileContainer({ productId }: { productId: string }) {
  // Uses React Query for data management
  const { data: product, isLoading, error } = useProduct({ productId })

  if (isLoading) return <Spinner />
  if (error) return <alert-dialog>Error loading product</alert-dialog>
  if (!product) return <div>Product not found</div>

  return <ProductProfile product={product} />
}

function ProductProfile({ product }: { product: Product }) {
  return (
    <div>
      <ProductHeader product={product} />
      <ProductBody product={product} />
    </div>
  )
}
```for non-API concerns (UI state, form state, etc.):

```tsx
// Before: Inline filter and sort state mixed with rendering
function ProductsList() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [isOpen, setIsOpen] = useState(false)

  const filtered = products
    .filter(p => p.name.includes(filter))
    .sort((a, b) =>
      sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : a.price - b.price
    )

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {/* 50+ lines of JSX */}
    </div>
  )
}

// After: Extracted custom hook for filter/sort logic
function useProductFiltering(products: Product[], initialSort: 'name' | 'price' = 'name') {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>(initialSort)

  const filtered = useMemo(() =>
    products
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) =>
        sortBy === 'name'
          ? a.name.localeCompare(b.name)
          : a.price - b.price
      ),
    [products, filter, sortBy]
  )

  return { filtered, filter, setFilter, sortBy, setSortBy }
}

function ProductsList() {
  const { data: products } = useProducts()
  const { filtered, filter, setFilter, sortBy, setSortBy } = useProductFiltering(products || [])

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {/* Cleaner JSX using filtered results */}
    </div>
  )
}
````

**Pattern:** Use custom hooks for **UI state logic**, API queries via **React Query**, and form state via **react-hook-form**. <div>
<SearchInput value={query} onChange={setQuery} />
{loading ? <Spinner /> : <ResultsList results={results} />}

</div>
)
}

````

#### 4. Utility Components
. Store in [`app/components/ui/`](/app/components/ui/) for shared components:

```tsx
// Before: Duplicate conditional rendering in multiple list components
function ProductsList() {
  const { data: products, isLoading, error } = useProducts()

  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>
  if (!products?.length) return <div className="text-gray-500">No products found</div>

  return <div>{/* 50+ lines of JSX */}</div>
}

function OrdersList() {
  const { data: orders, isLoading, error } = useOrders()

  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>
  if (!orders?.length) return <div className="text-gray-500">No orders found</div>

  return <div>{/* Similar 50+ lines of JSX */}</div>
}

// After: Extracted as a reusable UI utility
interface DataDisplayProps<T> {
  data: T[] | undefined
  isLoading: boolean
  error: Error | null
  emptyMessage: string
  children: (data: T[]) => React.ReactNode
}

export function DataDisplay<T>({
  data,
  isLoading,
  error,
  emptyMessage,
  children
}: DataDisplayProps<T>) {
  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">{error.message}</div>
  if (!data?.length) return <div className="text-gray-500">{emptyMessage}</div>

  return <>{children(data)}</>
}

// Now use across components
function ProductsList() {
  const { data: products, isLoading, error } = useProducts()

  return (
    <DataDisplay
      data={products}
      isLoading={isLoading}
      error={error}
      emptyMessage="No products found"
    >
      {products => <div>{/* Simplified JSX */}</div>}
    </DataDisplay>
  )
}
````

**Tip:** Reference existing UI components in [`app/components/ui/`](/app/components/ui/) like `Spinner`, `Button`, `Card`, etc.

````

## Step-by-Step Refactoring Procedure

### Phase 1: Analysis

#### 1.1 Read the Component

Read the entire component file to understand:

- What the component does (its primary responsibility)
- How many different concerns it handles
- What state it manages
- What side effects it has
- What parts of the JSX are repeated

#### 1.2 Identify Extraction Candidates

Look for:

**Visual Sections** - Self-contained UI blocks:

```tsx
// Header, sidebar, footer, card, modal, form sections
<div className="header">
  {/* 20+ lines of header JSX */}
</div>
````

**Repeated Patterns** - Similar JSX structures:

```tsx
{items.map(item => (
  <div key={item.id}>
    {/* Complex repeated structure */}
  </div>
))}
```

**Conditional Blocks** - Different UI for different states:

```tsx
{loading && <Spinner />}
{error && <ErrorMessage />}
{!data && <EmptyState />}
{data && <DataDisplay />}
```

**Event Handlers** - Business logic functions:

```tsx
const handleSubmit = async (data) => {
  // 20+ lines of logic
}
```

**Computed Values** - Derived state or transforms:

```tsx
const filteredItems = items
  .filter(/* ... */)
  .map(/* ... */)
  .sort(/* ... */)
```

#### 1.3 Map Dependencies

For each extraction candidate, identify:

- Props it needs
- State it accesses
- Functions it calls
- Context it consumes

### Phase 2: Planning

#### 2.1 Prioritize Extractions

Start with extractions that have:

1. **Fewest dependencies** - Easy wins that don't touch much state
2. **Highest reusability** - Components used in multiple places
3. **Clearest boundaries** - Well-defined responsibility
4. **Biggest impact** - Largest reduction in parent complexity

#### 2.2 Design Component APIs

For each component to extract, define:

```typescript
// Component interface
interface ComponentProps {
  // Required props
  requiredProp: Type

  // Optional props with defaults
  optionalProp?: Type

  // Callbacks
  onAction?: (data: Data) => void

  // Children or render props
  children?: React.ReactNode
}

// Export what others need
export type { ComponentProps }
export { Component }
```

#### 2.3 Plan File Organization

Decide on structure:

**Option 1: Co-located** (recommended for tightly coupled components)

```
UserProfile/
  UserProfile.tsx         # Main component
  UserProfileHeader.tsx   # Sub-component
  UserProfileBody.tsx     # Sub-component
  useUserData.ts         # Custom hook
  index.ts               # Exports
```

**Option 2: Shared** (for reusable components)

````
components/
  shared/
    Card.tsx
    DataState.tsx
**For feature-specific components**, co-locate with the feature. **For shared UI**, place in [`app/components/ui/`](/app/components/ui/).

**Step 1: Create the file**

```bash
# Feature-specific component (co-located)
touch app/features/products/components/ProductCard.tsx

# Shared UI component
touch app/components/ui/product-card.tsx
````

**Step 2: Define the interface with TypeScript**

```tsx
// app/features/products/components/ProductCard.tsx
interface ProductCardProps {
  product: Product
  onEdit?: (id: string) => void
  showActions?: boolean
}
```

**Step 3: Copy and adapt JSX using project's UI components**

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ProductCard({
  product,
  onEdit,
  showActions = true
}: ProductCardProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">${product.price}</p>
      {showActions && (
        <Button onClick={() => onEdit?.(product.id)} size="sm">
          Edit
        </Button>
      )}
    </Card>
  )
}
```

**Step 4: Add JSDoc documentation**

````tsx
/**
 * Displays a product in card format with optional actions.
 *
 * @param product - The product to display
 * @param onEdit - Callback when edit button is clicked
 * @param showActions - Whether to show action buttons (default: true)
 */
export function ProductCard({ ... }: ProductCardProps) {
  // ...
}
**Step 3: Copy and adapt JSX**

```tsx
export function UserCard({ user, onEdit, showActions = true }: UserCardProps) {
  return (
    <div className="card">
      {/* Copied and adapted JSX */}
    </div>
  )
}
````

**Step 4: Export from index**

```tsx
// index.ts
export { UserCard } from './UserCard'
export type { UserCardProps } from './UserCard'
```

#### 3.3 Update Parent Component

**Step 1: Import extracted components with @ path alias**

```tsx
import { ProductCard } from '@/features/products/components/ProductCard'
import { useProducts } from '@/features/products/api/get-products'
```

**Step 2: Replace inline code with component**

```tsx
// Before
<div className="card">
  <h3>{product.name}</h3>
  {/* 30+ lines of JSX */}
</div>

// After
<ProductCard
  product={product}
  onEdit={handleEdit}
  showActions={true}
/>
```

**Step 3: Remove unused code**

- Delete extracted JSX
- Remove unused state (if using React Query, it's already managed there)
- Remove unused functions
- Clean up imports

### Phase 4: Verification

#### 4.1 Type Safety Check

```bash
# Verify TypeScript compiles (dev server auto-checks too)
npm run lint
```

Your project uses ESLint with TypeScript rules, so errors appear in VS Code's **Problems** panel.

#### 4.2 Functionality Check

Test that:

- [ ] Component renders correctly
- [ ] All interactions work (buttons, inputs, etc.)
- [ ] State updates properly
- [ ] Side effects still trigger
- [ ] Error states still display
- [ ] Loading states still work

#### 4.3 Performance Check

Verify:

- [ ] No unnecessary re-renders introduced
- [ ] Memoization still effective where needed
- [ ] No performance regressions

#### 4.4 Code Quality Check

Ensure:

- [ ] All props have TypeScript types
- [ ] No ESLint/React warnings
- [ ] Props are documented (JSDoc if needed)
- [ ] Component has clear single responsibility
- [ ] Naming is clear and consistent

### Phase 5: Refinement

#### 5.1 Optimize Further

After successful extraction:

**Add React.memo if needed:**

```tsx
export const UserCard = memo(function UserCard({ user, onEdit }: UserCardProps) {
  // Component implementation
})
```

**Extract more if still complex:**

- If extracted component >150 lines, consider further extraction
- If multiple responsibilities remain, extract more

**Improve prop APIs:**

```tsx
// Before: Passing too many individual props
<Header title={title} subtitle={subtitle} icon={icon} showBadge={showBadge} />

// After: Group related props
<Header metadata={{ title, subtitle, icon }} showBadge={showBadge} />
```

#### 5.2 Add Documentation

Add JSDoc comments for exported components:

```tsx
/**
 * Displays user information in a card layout.
 *
 * @param user - The user object to display
 * @param onEdit - Callback when edit button is clicked
 * @param showActions - Whether to show action buttons (default: true)
 */
export function UserCard({ user, onEdit, showActions = true }: UserCardProps) {
  // ...
}
```

## Decision Tree

### When to Extract a Sub-Component?

```
Is this section:
├─ Used in multiple places? → YES → Extract as shared component
├─ Self-contained UI block? → YES → Extract as presentational component
├─ Has complex logic? → YES → Extract logic to custom hook
├─ Over 50 lines of JSX? → YES → Extract as sub-component
└─ Hurts readability? → YES → Extract as sub-component
```

### What to Name It?

```
Component purpose:
├─ Displays data? → [Entity]Display, [Entity]Card, [Entity]Item
├─ Form for editing? → [Entity]Form, [Entity]Editor
├─ Lists items? → [Entity]List, [Entity]Grid
├─ Contains logic? → [Entity]Container, [Entity]Provider
├─ Wraps children? → [Feature]Wrapper, [Feature]Layout
└─ Handles state? → use[Feature], use[Entity]State (custom hook)
```

### Where to Place It?

Follow the **bulletproof-react** structure:

```
Component is:
├─ Feature-specific form/list/detail? → app/features/[feature]/components/
├─ Reusable UI component (button, card, etc.)? → app/components/ui/
├─ Layout or container wrapper? → app/routes/ or app/components/layouts/
└─ Custom data/UI logic? → app/hooks/ or app/features/[feature]/
```

\*\*Examples fromRefactoring Feature-Specific Lists

Extract components from complex list views in `features/[feature]/components/`:

**Before:**

```tsx
// app/routes/products.tsx - 300+ lines with inline cards, forms, filters
function ProductsPage() {
  const [filter, setFilter] = useState('')
  const { data: products } = useProducts()
  // Complex filter/sort logic mixed with rendering
  return <div>{/* 250+ lines of JSX */}</div>
}
```

**After:**

```tsx
// app/routes/products.tsx - Clean and focused
import { ProductsList } from '@/features/products/components/products-list'

function ProductsPage() {
  return <ProductsList />
}

// app/features/products/components/ProductsList.tsx - New extracted component
function ProductsList() {
  const [filter, setFilter] = useState('')
  const { data: products } = useProducts()
  const { filtered, sortBy } = useProductFiltering(products)

  return (
    <div className="space-y-4">
      <ProductsFilters filter={filter} setFilter={setFilter} />
      <ProductsGrid products={filtered} sortBy={sortBy} />
    </div>
  )
}

// app/features/products/components/ProductsFilters.tsx
function ProductsFilters({ filter, setFilter }) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search products..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
    </div>
  )
}

// app/features/products/components/ProductsGrid.tsx
function ProductsGrid({ products, sortBy }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

- [ProductsList](/app/features/products/components/products-list.tsx) - Feature component
- [Button](/app/components/ui/button.tsx) - Shared UI component
- [AllProducts](/app/routes/dashboard/all-products.tsx) - Route/container component

## Common Patterns

### Pattern 1: Split Form Sections

```tsx
// Before: Monolithic form
function UserForm() {
  return (
    <form>
      {/* 200+ lines of form fields */}
    </form>
  )
}

// After: Sectioned form
function UserForm() {
  return (
    <form>
      <PersonalInfoSection />
      <AddressSection />
      <PreferencesSection />
    </form>
  )
}
```

### Pattern 2: Separate Data from Presentation

```tsx
// Before: Mixed data and UI
function ProductCard() {
  const [product, setProduct] = useState(null)
  useEffect(() => { /* fetch */ }, [])

  return <div>{/* render */}</div>
}

// After: Separated concerns
function ProductCardContainer({ productId }: { productId: string }) {
  const { product, loading, error } = useProduct(productId)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return <ProductCard product={product} />
}

function ProductCard({ product }: { product: Product }) {
  return <div>{/* render */}</div>
}
```

### Pattern 3: Extract Layout Components

```tsx
// Before: Inline layout
function Dashboard() {
  return (
    <div className="dashboard">
      <div className="sidebar">
        {/* sidebar content */}
      </div>
      <div className="main">
        {/* main content */}
      </div>
    </div>
  )
}

// After: Layout component
function DashboardLayout({
  sidebar,
  main
}: {
  sidebar: React.ReactNode
  main: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <div className="sidebar">{sidebar}</div>
      <div className="main">{main}</div>
    </div>
  )
}

function Dashboard() {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      main={<MainContent />}
    />
  )
}
```

## Quality Metrics

### Before Refactoring

Measure baseline:

- Component line count
- Number of useState calls
- Number of useEffect calls
- Cyclomatic complexity
- JSX nesting depth

### After Refactoring

Target improvements:

- **Parent component**: <200 lines
- **Sub-components**: <100 lines each
- **Hooks per component**: <5
- **Props per component**: <8
- **JSX nesting depth**: <4 levels

### Success Criteria

Refactoring is successful if:

- [ ] Parent component is <50% of original size
- [ ] Each component has single, clear responsibility
- [ ] Components are independently testable
- [ ] No duplicate code remains
- [ ] Type safety maintained
- [ ] All functionality preserved
- [ ] Performance not degraded

## Output Format

After completing refactoring, provide:

### 📊 Refactoring Summary

**Original Component**: [ComponentName.tsx]

- Lines of code: [original count]
- Components: 1
- Responsibilities: [list them]

**After Refactoring**:

- Lines of code: [new parent count] (−X% reduction)
- Components: [count]
  - [ParentComponent.tsx]: [lines] - [responsibility]
  - [SubComponent1.tsx]: [lines] - [responsibility]
  - [SubComponent2.tsx]: [lines] - [responsibility]
  - [hooks/useCustomHook.ts]: [lines] - [responsibility]

### 🎯 Extracted Components

#### [SubComponent1]

**Purpose**: [What it does]
**Location**: [File path]
**Props**: [List key props]
**Reusability**: [Used in X places / Highly reusable / Component-specific]

#### [SubComponent2]

**Purpose**: [What it does]
**Location**: [File path]
**Props**: [List key props]
**Reusability**: [Assessment]

### ✅ Verification Results

- [x] TypeScript compiles without errors
- [x] All functionality preserved
- [x] No new React warnings
- [x] Performance maintained
- [x] Code quality improved

### 📝 Testing Recommendations

1. Test [specific scenario]
2. Verify [specific functionality]
3. Check [edge case]

### 🔄 Further Refactoring Opportunities

- [Optional improvement 1]
- [Optional improvement 2]

## Tips and Best Practices

### DO:

- ✅ Start with smallest, easiest extractions first
- ✅ Extract one component at a time and verify
- ✅ Keep related components close in folder structure
- ✅ Use TypeScript interfaces for all props
- ✅ Test after each extraction
- ✅ Preserve existing functionality exactly
- ✅ Add React.memo only when needed for performance

### DON'T:

- ❌ Extract too many components at once (hard to debug)
- ❌ Create components that are too small (<20 lines, single div)
- ❌ Over-engineer with unnecessary abstraction
- ❌ Break working functionality
- ❌ Create components with too many props (>10)
- ❌ Extract before understanding the full component
- ❌ Forget to clean up unused code in parent

## Common Pitfalls

### Pitfall 1: Premature Extraction

**Problem**: Extracting before understanding dependencies
**Solution**: Complete Phase 1 analysis thoroughly

### Pitfall 2: Over-Splitting

**Problem**: Too many tiny components (analysis paralysis)
**Solution**: Only extract if >50 lines or clear reusability

### Pitfall 3: Props Explosion

**Problem**: New component needs 15 props
**Solution**: Component may be wrong boundary; group related props into objects

### Pitfall 4: Breaking Memoization

**Problem**: Extracted component receives new object/function every render
**Solution**: Use useCallback for functions, useMemo for objects passed to memoized children

### Pitfall 5: Lost Context

**Problem**: Extracted component can't access Context
**Solution**: Pass Context values as props or keep component within Provider

## When NOT to Refactor

Skip refactoring if:

- Component is <150 lines and has single responsibility
- Component is simple and easy to understand
- Team is under tight deadline (technical debt acceptable)
- Component is rarely changed or viewed
- Extraction would require complex prop drilling
- Component is scheduled for deletion/rewrite

## Summary

This skill provides a systematic approach to refactoring complex React components:

1. **Analyze** the component to understand its structure and identify extraction opportunities
2. **Plan** what to extract, how to structure it, and in what order
3. **Implement** extractions one at a time, starting with hooks and moving to components
4. **Verify** that functionality is preserved and quality improved
5. **Refine** with further optimizations and documentation

The goal is maintainable, testable, reusable components with clear responsibilities.
