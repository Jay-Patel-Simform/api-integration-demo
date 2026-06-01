# Refactoring Patterns

Proven patterns for SonarQube issues. Pick the **simplest** one that solves the problem.

---

## Quick Reference

| Pattern                                           | Rules        | Use When                                    |
| ------------------------------------------------- | ------------ | ------------------------------------------- |
| [Extract Function](#1-extract-function)           | S3776, S1541 | Function has multiple responsibilities      |
| [Early Return](#2-early-return)                   | S3776, S134  | Nested ifs / precondition checks            |
| [Extract Boolean](#3-extract-boolean-variable)    | S1067, S3776 | Complex multi-operator conditions           |
| [Object Map](#4-object-map)                       | S3776, S1541 | Long switch / if-else chains                |
| [Named Constant](#5-named-constant)               | S1192, S109  | Value appears 3+ times or has meaning       |
| [Memoization](#6-memoize-with-usecallbackusememo) | S4143        | Function in useEffect dep / passed to child |
| [Custom Hook](#7-extract-custom-hook)             | S3776, S4144 | Same stateful logic in multiple components  |
| [Invert Condition](#8-invert-condition)           | S3776, S134  | Positive nesting can become early exit      |
| [Component Map](#9-component-map)                 | S3776        | Type-based JSX branching                    |
| [Array Pipeline](#10-array-pipeline)              | S3776        | Sequential data transformations             |
| [Nullish Coalescing](#11-nullish-coalescing)      | S4325        | Default values for null/undefined           |
| [Type Guard](#12-type-guard)                      | S2589        | Repeated `typeof` / `in` checks             |

---

## 1. Extract Function

**Rules:** S3776, S1541

```tsx
// ❌ Before — one large function, complexity 28
function processData(data: Data[], filter: string) {
  // 70 lines of mixed setup / validation / transform / API / response
}

// ✅ After — coordinator + focused helpers
function processData(data: Data[]): ProcessedResult {
  const validated  = validateData(data)
  const transformed = transformData(validated)
  const result     = sendToAPI(transformed)
  return handleResponse(result)
}

function validateData(data: Data[]): ValidData[]     { /* ... */ }
function transformData(data: ValidData[]): Payload   { /* ... */ }
function sendToAPI(data: Payload): Promise<Response> { /* ... */ }
function handleResponse(r: Response): ProcessedResult { /* ... */ }
```

---

## 2. Early Return

**Rules:** S3776, S134

```tsx
// ❌ Before — 3 levels of nesting
function process(user: User | null) {
  if (user) {
    if (user.verified) {
      if (user.active) {
        // main logic
      }
    }
  }
}

// ✅ After — flat
function process(user: User | null) {
  if (!user)          return
  if (!user.verified) return
  if (!user.active)   return
  // main logic
}

// Loop variant — use continue
for (const item of items) {
  if (!item.valid)  continue
  if (!item.active) continue
  // process
}
```

---

## 3. Extract Boolean Variable

**Rules:** S1067, S3776

```tsx
// ❌ Before — complex expression inline
if ((user.role === 'admin' || user.role === 'owner') &&
    user.verified && !user.suspended &&
    (user.level > 10 || user.premium)) { }

// ✅ After — self-documenting variables
const isPrivilegedRole  = user.role === 'admin' || user.role === 'owner'
const isVerifiedActive  = user.verified && !user.suspended
const hasHighStatus     = user.level > 10 || user.premium

if (isPrivilegedRole && isVerifiedActive && hasHighStatus) { }
```

---

## 4. Object Map

**Rules:** S3776, S1541

```tsx
// ❌ Before — switch with growing cases
function getIcon(type: string) {
  switch (type) {
    case 'success': return <CheckIcon />
    case 'error':   return <XIcon />
    case 'warning': return <AlertIcon />
    default:        return <QuestionIcon />
  }
}

// ✅ After — object map
const ICON_MAP: Record<string, JSX.Element> = {
  success: <CheckIcon />,
  error:   <XIcon />,
  warning: <AlertIcon />,
}
const getIcon = (type: string) => ICON_MAP[type] ?? <QuestionIcon />

// With functions
type Op = (a: number, b: number) => number
const OPERATIONS: Record<string, Op> = {
  add:      (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide:   (a, b) => b !== 0 ? a / b : 0,
}
const calculate = (op: string, a: number, b: number) => OPERATIONS[op]?.(a, b) ?? 0
```

---

## 5. Named Constant

**Rules:** S1192, S109

```tsx
// ❌ Before
fetch('https://api.example.com/v1/users')
fetch('https://api.example.com/v1/products')
const cache = Date.now() + 86400000
if (score > 0.75) { }

// ✅ After
const API_BASE_URL          = 'https://api.example.com/v1'
const MS_PER_DAY            = 24 * 60 * 60 * 1000
const PASSING_SCORE         = 0.75

fetch(`${API_BASE_URL}/users`)
fetch(`${API_BASE_URL}/products`)
const cache = Date.now() + MS_PER_DAY
if (score > PASSING_SCORE) { }

// Group related constants
const TIMEOUT_MS = { RED: 3000, YELLOW: 5000, GREEN: 10000 } as const
```

---

## 6. Memoize with useCallback/useMemo

**Rule:** S4143

```tsx
// ❌ Before — new function reference every render
function Parent() {
  const handleClick = (id: string) => selectItem(id)
  return <Child onClick={handleClick} />
}

// ✅ After
function Parent() {
  const handleClick = useCallback((id: string) => selectItem(id), [])
  return <Child onClick={handleClick} />
}

// Expensive computation
function DataTable({ items }: Props) {
  const processedItems = useMemo(
    () => items.filter(i => i.active).sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )
  return <Table data={processedItems} />
}
```

---

## 7. Extract Custom Hook

**Rules:** S3776, S4144

```tsx
// ❌ Before — stateful logic duplicated across components
// ✅ After — extracted hook

function useUser(userId: string) {
  const [user, setUser]     = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<Error | null>(null)

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  return { user, loading, error }
}

function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUser(userId)
  if (loading) return <Loading />
  if (error)   return <Error error={error} />
  if (!user)   return <NotFound />
  return <div>{user.name}</div>
}
```

---

## 8. Invert Condition

**Rules:** S3776, S134

```tsx
// ❌ Before
function process(data: Data | null) {
  if (data) {
    if (data.items) {
      if (data.items.length > 0) {
        // logic
      }
    }
  }
}

// ✅ After
function process(data: Data | null) {
  if (!data)                  return
  if (!data.items)            return
  if (data.items.length === 0) return
  // logic — no nesting
}
```

---

## 9. Component Map

**Rule:** S3776

```tsx
// ❌ Before — growing if/switch on item.type
function render(item: Item) {
  if (item.type === 'text')  return <TextDisplay  {...item} />
  if (item.type === 'image') return <ImageDisplay {...item} />
  if (item.type === 'video') return <VideoPlayer  {...item} />
  return <UnknownItem />
}

// ✅ After
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  text:  TextDisplay,
  image: ImageDisplay,
  video: VideoPlayer,
}

function render(item: Item) {
  const Component = COMPONENT_MAP[item.type]
  return Component ? <Component {...item} /> : <UnknownItem />
}
```

---

## 10. Array Pipeline

**Rule:** S3776

```tsx
// ❌ Before — intermediate variables, nested calls
function processItems(items: Item[]) {
  const active    = items.filter(i => i.active)
  const validated = active.filter(isValid)
  const mapped    = validated.map(transform)
  return mapped.sort((a, b) => a.score - b.score)
}

// ✅ After — chain
const processItems = (items: Item[]) =>
  items
    .filter(i => i.active)
    .filter(isValid)
    .map(transform)
    .sort((a, b) => a.score - b.score)
```

---

## 11. Nullish Coalescing

**Rule:** S4325

```tsx
// ❌ Wrong — || treats 0 / '' / false as null
const count = data?.count || 10   // 0 becomes 10!
const name  = user?.name  || 'Guest'  // '' becomes 'Guest'!

// ✅ Correct — ?? only handles null / undefined
const count = data?.count  ?? 10
const name  = user?.name   ?? 'Guest'
const value = a?.b?.c?.val ?? DEFAULT
```

---

## 12. Type Guard

**Rule:** S2589

```tsx
// ❌ Before — repeated unsafe assertions
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'id' in data) {
    const item = data as Item
    return item.id
  }
}

// ✅ After — reusable type guard
function isItem(data: unknown): data is Item {
  return typeof data === 'object' && data !== null &&
         'id' in data && typeof (data as Item).id === 'string'
}

function process(data: unknown) {
  if (isItem(data)) return data.id  // TypeScript narrows here
}
```

---

## Checklist

**Before:** Understand the logic fully · identify the smell · pick the simplest pattern.  
**During:** Apply step by step · preserve behavior · keep types · leave UI unchanged.  
**After:** Run tests · verify TypeScript compiles · confirm SonarQube issue resolved.
