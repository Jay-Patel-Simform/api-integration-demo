# Component Extraction Templates

Quick-start templates aligned with the project's **React Query + Zod** architecture.

## Presentational Component Template

Use for pure UI components that only render props (no data fetching or state).

```tsx
// app/features/[feature]/components/[ComponentName].tsx
import { Button } from '@/components/ui/button'

interface [ComponentName]Props {
  // Required props
  data: DataType
  // Optional callbacks
  onAction?: (id: string) => void
  // Optional display options
  showActions?: boolean
}

/**
 * Displays [brief description of what this renders].
 *
 * @param data - The data to display
 * @param onAction - Callback when action button is clicked
 * @param showActions - Whether to show action buttons (default: true)
 */
export function [ComponentName]({
  data,
  onAction,
  showActions = true
}: [ComponentName]Props) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{data.title}</h3>
      <p className="text-sm text-gray-600">{data.description}</p>
      {showActions && (
        <Button onClick={() => onAction?.(data.id)} size="sm">
          Action
        </Button>
      )}
    </div>
  )
}
```

## Container Component with React Query

Use for components that fetch data or manage complex state.

```tsx
// app/features/[feature]/components/[Feature]Container.tsx
import { useQueryClient } from '@tanstack/react-query'
import { use[Feature] } from '@/features/[feature]/api/get-[feature]'
import { Spinner } from '@/components/ui/spinner'
import { [Feature] } from './[Feature]'

interface [Feature]ContainerProps {
  id: string
}

/**
 * Container component that manages data fetching for [Feature].
 * Handles loading, error, and empty states before rendering the presentational component.
 */
export function [Feature]Container({ id }: [Feature]ContainerProps) {
  const { data, isLoading, error } = use[Feature]({ id })

  if (isLoading) return <Spinner />
  if (error) return <div className="text-red-500">Error: {error.message}</div>
  if (!data) return <div className="text-gray-500">Not found</div>

  return <[Feature] data={data} />
}

// app/features/[feature]/components/[Feature].tsx
interface [Feature]Props {
  data: [FeatureType]
}

export function [Feature]({ data }: [Feature]Props) {
  return (
    <div>
      {/* Render data here */}
    </div>
  )
}
```

## Custom Hook for UI State

Use for form state, filters, sorting, or other **non-API** state logic.

```tsx
// app/hooks/use[Feature]Filters.ts
import { useState, useMemo } from 'react'

interface Use[Feature]FiltersOptions {
  initialSort?: 'name' | 'date'
}

interface Use[Feature]FiltersReturn {
  filter: string
  setFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  filtered: [ItemType][]
}

/**
 * Custom hook for managing [feature] filter and sort state.
 * Memoizes filtered results to prevent unnecessary re-renders.
 *
 * @param items - The items to filter
 * @param options - Optional configuration (initialSort, etc.)
 * @returns Filter state and filtered results
 */
export function use[Feature]Filters(
  items: [ItemType][] = [],
  options: Use[Feature]FiltersOptions = {}
): Use[Feature]FiltersReturn {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState(options.initialSort || 'name')

  const filtered = useMemo(() =>
    items
      .filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) =>
        sortBy === 'name'
          ? a.name.localeCompare(b.name)
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [items, filter, sortBy]
  )

  return { filter, setFilter, sortBy, setSortBy, filtered }
}
```

## Shared UI Component Template

Place in [`app/components/ui/`](/app/components/ui/) for components reused across features.

```tsx
// app/components/ui/[component-name].tsx
import { ReactNode } from 'react'

interface [ComponentName]Props {
  children: ReactNode
  variant?: 'default' | 'secondary'
  className?: string
}

/**
 * Reusable UI component for [description].
 * Used across multiple features for consistent styling.
 *
 * @param children - Content to display
 * @param variant - Visual style variant (default: 'default')
 * @param className - Additional CSS classes
 */
export function [ComponentName]({
  children,
  variant = 'default',
  className = ''
}: [ComponentName]Props) {
  const variants = {
    default: 'bg-white border border-gray-200 rounded-lg',
    secondary: 'bg-gray-50 border border-gray-300 rounded-lg'
  }

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}
```

const refetch = useCallback(() => {
setLoading(true)
setError(null)

    fetchData(dependency)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))

}, [dependency])

useEffect(() => {
if (options.enabled !== false) {
refetch()
}
}, [refetch, options.enabled])

return { data, loading, error, refetch }
}

````

## Layout Component Template

```tsx
// [LayoutName]Layout.tsx
interface [LayoutName]LayoutProps {
  children?: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
}

/**
 * Layout component providing consistent structure for [section/feature]
 */
export function [LayoutName]Layout({
  children,
  header,
  sidebar,
  footer
}: [LayoutName]LayoutProps) {
  return (
    <div className="[layout-name]-layout">
      {header && (
        <header className="[layout-name]-header">
          {header}
        </header>
      )}

      <div className="[layout-name]-body">
        {sidebar && (
          <aside className="[layout-name]-sidebar">
            {sidebar}
          </aside>
        )}

        <main className="[layout-name]-main">
          {children}
        </main>
      </div>

      {footer && (
        <footer className="[layout-name]-footer">
          {footer}
        </footer>
      )}
    </div>
  )
}
````

## Compound Component Template

```tsx
// [ComponentName].tsx
interface [ComponentName]ContextType {
  // Shared state
  activeId: string | null
  setActiveId: (id: string | null) => void
}

const [ComponentName]Context = createContext<[ComponentName]ContextType | undefined>(undefined)

function use[ComponentName]Context() {
  const context = useContext([ComponentName]Context)
  if (!context) {
    throw new Error('Component must be used within [ComponentName]')
  }
  return context
}

// Root component
interface [ComponentName]Props {
  defaultActiveId?: string
  children: React.ReactNode
}

export function [ComponentName]({
  defaultActiveId,
  children
}: [ComponentName]Props) {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId || null)

  return (
    <[ComponentName]Context.Provider value={{ activeId, setActiveId }}>
      <div className="[component-name]">
        {children}
      </div>
    </[ComponentName]Context.Provider>
  )
}

// Sub-component
interface [SubComponent]Props {
  id: string
  children: React.ReactNode
}

function [SubComponent]({ id, children }: [SubComponent]Props) {
  const { activeId, setActiveId } = use[ComponentName]Context()
  const isActive = activeId === id

  return (
    <div
      className={isActive ? 'active' : ''}
      onClick={() => setActiveId(id)}
    >
      {children}
    </div>
  )
}

// Attach sub-components
[ComponentName].[SubComponent] = [SubComponent]
```

## Index File Template

```tsx
// index.ts
export { [ComponentName] } from './[ComponentName]'
export type { [ComponentName]Props } from './[ComponentName]'

// If there are sub-components
export { [SubComponentName] } from './[SubComponentName]'
export type { [SubComponentName]Props } from './[SubComponentName]'

// If there are hooks
export { use[HookName] } from './use[HookName]'
export type { Use[HookName]Return } from './use[HookName]'
```

## Usage

Replace placeholders:

- `[ComponentName]` - The actual component name (e.g., UserCard, ProductList)
- `[FeatureName]` - Feature or domain name (e.g., User, Product)
- `[DataType]` - The TypeScript type for data (e.g., User, Product[])
- `[LayoutName]` - Layout identifier (e.g., Dashboard, Settings)
- `[SubComponent]` - Sub-component name (e.g., Tab, Item)
- `[HookName]` - Custom hook name (e.g., Fetch, LocalStorage)
