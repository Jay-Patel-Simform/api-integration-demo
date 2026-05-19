# Refactoring Patterns for SonarQube Issues

Proven patterns for addressing common SonarQube issues without changing behavior.

---

## Pattern 1: Extract Function

**Use For:** S3776 (cognitive complexity), S1541 (function too complex)

**When to Apply:**

- Function has multiple responsibilities
- Code sections can be named meaningfully
- Logic is reusable elsewhere

**Template:**

```tsx
// Before
function largFunction(data: Data) {
  // Setup logic (10 lines)
  // Validation logic (15 lines)
  // Transform logic (20 lines)
  // API call logic (10 lines)
  // Response handling (15 lines)
}

// After
function processData(data: Data) {
  const validated = validateData(data)
  const transformed = transformData(validated)
  const result = await sendToAPI(transformed)
  return handleResponse(result)
}

function validateData(data: Data): ValidData { /* ... */ }
function transformData(data: ValidData): TransformedData { /* ... */ }
function sendToAPI(data: TransformedData): Promise<Response> { /* ... */ }
function handleResponse(result: Response): ProcessedResult { /* ... */ }
```

**Benefits:**

- Each function has single responsibility
- Easier to test
- Improved readability
- Reduced complexity

---

## Pattern 2: Early Return (Guard Clause)

**Use For:** S3776, S134 (nested depth)

**When to Apply:**

- Multiple nested if statements
- Error/invalid state checks
- Precondition validation

**Template:**

```tsx
// Before - Nested ifs
function process(user: User | null) {
  if (user) {
    if (user.verified) {
      if (user.active) {
        // main logic
      }
    }
  }
}

// After - Early returns
function process(user: User | null) {
  if (!user) return
  if (!user.verified) return
  if (!user.active) return

  // main logic (no nesting!)
}
```

**Loop Version:**

```tsx
// Before
for (const item of items) {
  if (item.valid) {
    if (item.active) {
      // process
    }
  }
}

// After
for (const item of items) {
  if (!item.valid) continue
  if (!item.active) continue

  // process (no nesting!)
}
```

---

## Pattern 3: Extract Boolean Variable

**Use For:** S1067 (complex expression), S3776 (complexity)

**When to Apply:**

- Complex boolean conditions
- Multiple operators in if statement
- Condition used multiple times

**Template:**

```tsx
// Before
if ((user.role === 'admin' || user.role === 'owner') &&
    user.verified &&
    !user.suspended &&
    (user.level > 10 || user.premium)) {
  // allow
}

// After
const isPrivilegedRole = user.role === 'admin' || user.role === 'owner'
const isVerifiedActive = user.verified && !user.suspended
const hasHighStatus = user.level > 10 || user.premium

if (isPrivilegedRole && isVerifiedActive && hasHighStatus) {
  // allow
}
```

**Benefits:**

- Self-documenting code
- Easier to debug
- Reusable conditions
- Reduced complexity

---

## Pattern 4: Object Map (Replace Switch/If-Else Chain)

**Use For:** S3776, S1541

**When to Apply:**

- Long switch statements
- Multiple if-else-if chains
- Type-based branching

**Template:**

```tsx
// Before - Switch statement
function getIcon(type: string) {
  switch (type) {
    case 'success': return <CheckIcon />
    case 'error': return <XIcon />
    case 'warning': return <AlertIcon />
    case 'info': return <InfoIcon />
    default: return <QuestionIcon />
  }
}

// After - Object map
const ICON_MAP: Record<string, JSX.Element> = {
  success: <CheckIcon />,
  error: <XIcon />,
  warning: <AlertIcon />,
  info: <InfoIcon />
}

function getIcon(type: string) {
  return ICON_MAP[type] ?? <QuestionIcon />
}
```

**With Functions:**

```tsx
// Before
function calculate(operation: string, a: number, b: number) {
  if (operation === 'add') return a + b
  if (operation === 'subtract') return a - b
  if (operation === 'multiply') return a * b
  if (operation === 'divide') return b !== 0 ? a / b : 0
  return 0
}

// After
type Operation = (a: number, b: number) => number

const OPERATIONS: Record<string, Operation> = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : 0
}

function calculate(operation: string, a: number, b: number): number {
  const fn = OPERATIONS[operation]
  return fn ? fn(a, b) : 0
}
```

---

## Pattern 5: Extract Named Constant

**Use For:** S1192 (duplicate strings), S109 (magic numbers)

**When to Apply:**

- String/number appears 3+ times
- Value has business meaning
- Value might change

**Template:**

```tsx
// Before
fetch('https://api.example.com/users')
setTimeout(callback, 5000)
if (score > 0.75) { /* pass */ }

// After
const API_BASE_URL = 'https://api.example.com'
const FIVE_SECONDS_MS = 5000
const PASSING_SCORE_THRESHOLD = 0.75

fetch(`${API_BASE_URL}/users`)
setTimeout(callback, FIVE_SECONDS_MS)
if (score > PASSING_SCORE_THRESHOLD) { /* pass */ }
```

**Grouping Related Constants:**

```tsx
// Before
const redTimeout = 3000
const yellowTimeout = 5000
const greenTimeout = 10000

// After - Grouped in object
const TIMEOUT_MS = {
  RED: 3000,
  YELLOW: 5000,
  GREEN: 10000
} as const

// Usage
setTimeout(callback, TIMEOUT_MS.RED)
```

---

## Pattern 6: Memoize with useCallback/useMemo

**Use For:** S4143 (hook dependencies)

**When to Apply:**

- Function passed to child component
- Function used in useEffect dependency
- Expensive computation

**Template:**

```tsx
// Before - New function every render
function Parent() {
  const handleClick = (id: string) => {
    // handle click
  }

  return <Child onClick={handleClick} />
}

// After - Memoized callback
function Parent() {
  const handleClick = useCallback((id: string) => {
    // handle click
  }, []) // add dependencies if needed

  return <Child onClick={handleClick} />
}
```

**With useMemo:**

```tsx
// Before - Recalculated every render
function DataTable({ items }: Props) {
  const filteredItems = items.filter(item => item.active)
  const sortedItems = filteredItems.sort((a, b) => a.name.localeCompare(b.name))

  return <Table data={sortedItems} />
}

// After - Memoized computation
function DataTable({ items }: Props) {
  const processedItems = useMemo(() => {
    const filtered = items.filter(item => item.active)
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  return <Table data={processedItems} />
}
```

---

## Pattern 7: Extract Custom Hook

**Use For:** S3776, S1541, S4144 (duplicate logic in multiple components)

**When to Apply:**

- Logic used in multiple components
- Complex stateful logic
- Side effect management

**Template:**

```tsx
// Before - Logic in component
function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error) return <Error error={error} />
  if (!user) return <NotFound />

  return <div>{user.name}</div>
}

// After - Extracted hook
function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { user, loading, error }
}

function UserProfile() {
  const { user, loading, error } = useUser()

  if (loading) return <Loading />
  if (error) return <Error error={error} />
  if (!user) return <NotFound />

  return <div>{user.name}</div>
}
```

---

## Pattern 8: Invert Condition

**Use For:** S3776, S134 (nested conditions)

**When to Apply:**

- Negative conditions more natural
- Reduces nesting level

**Template:**

```tsx
// Before - Nested positive check
function process(data: Data | null) {
  if (data) {
    if (data.items) {
      if (data.items.length > 0) {
        // process items
      }
    }
  }
}

// After - Inverted with early returns
function process(data: Data | null) {
  if (!data) return
  if (!data.items) return
  if (data.items.length === 0) return

  // process items (no nesting!)
}
```

---

## Pattern 9: Polymorphism (Strategy Pattern)

**Use For:** S3776, type-based branching

**When to Apply:**

- Type-based behavior
- Multiple implementations of same interface
- Growing switch statements

**Template:**

```tsx
// Before - Type checking and branching
function render(item: Item) {
  if (item.type === 'text') {
    return <TextDisplay text={item.content} />
  }
  if (item.type === 'image') {
    return <ImageDisplay src={item.url} />
  }
  if (item.type === 'video') {
    return <VideoPlayer url={item.url} />
  }
  return <UnknownItem />
}

// After - Component map
interface BaseItem {
  type: string
}

interface TextItem extends BaseItem {
  type: 'text'
  content: string
}

interface ImageItem extends BaseItem {
  type: 'image'
  url: string
}

const COMPONENT_MAP = {
  text: TextDisplay,
  image: ImageDisplay,
  video: VideoPlayer
}

function render(item: Item) {
  const Component = COMPONENT_MAP[item.type]
  return Component ? <Component {...item} /> : <UnknownItem />
}
```

---

## Pattern 10: Compose Functions

**Use For:** S3776, sequential transformations

**When to Apply:**

- Data flows through multiple transformations
- Each step is independent
- Pipeline pattern

**Template:**

```tsx
// Before - Nested operations
function process(data: RawData) {
  const validated = validate(data)
  const sanitized = sanitize(validated)
  const formatted = format(sanitized)
  const enriched = enrich(formatted)
  return enriched
}

// Better - Composition
const process = compose(
  validate,
  sanitize,
  format,
  enrich
)

// Utility
function compose<T>(...fns: Array<(arg: T) => T>) {
  return (initialValue: T) =>
    fns.reduce((value, fn) => fn(value), initialValue)
}
```

**Array Pipeline:**

```tsx
// Before - Multiple intermediate variables
function processItems(items: Item[]) {
  const active = items.filter(item => item.active)
  const validated = active.filter(item => isValid(item))
  const mapped = validated.map(item => transform(item))
  const sorted = mapped.sort((a, b) => a.score - b.score)
  return sorted
}

// After - Chained pipeline
function processItems(items: Item[]) {
  return items
    .filter(item => item.active)
    .filter(isValid)
    .map(transform)
    .sort((a, b) => a.score - b.score)
}
```

---

## Pattern 11: Nullish Coalescing

**Use For:** S4325 (optional chaining)

**When to Apply:**

- Default values for null/undefined
- Avoiding falsy value bugs

**Template:**

```tsx
// ❌ Wrong - || treats 0, '', false as null
const count = data?.count || 10 // 0 becomes 10!
const name = user?.name || 'Guest' // '' becomes 'Guest'!

// ✅ Correct - ?? only handles null/undefined
const count = data?.count ?? 10 // 0 stays 0
const name = user?.name ?? 'Guest' // '' stays ''

// Chaining
const value = data?.level1?.level2?.value ?? DEFAULT_VALUE
```

---

## Pattern 12: Type Guard Functions

**Use For:** S2589, type narrowing

**When to Apply:**

- Type discrimination needed
- Multiple type checks

**Template:**

```tsx
// Before - Type assertions
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'id' in data) {
    const item = data as Item
    return item.id
  }
}

// After - Type guard
function isItem(data: unknown): data is Item {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as Item).id === 'string'
  )
}

function process(data: unknown) {
  if (isItem(data)) {
    return data.id // TypeScript knows data is Item
  }
}
```

---

## Quick Reference

| Pattern            | SonarQube Rules | Benefit              |
| ------------------ | --------------- | -------------------- |
| Extract Function   | S3776, S1541    | Reduces complexity   |
| Early Return       | S3776, S134     | Reduces nesting      |
| Extract Boolean    | S1067, S3776    | Clarifies logic      |
| Object Map         | S3776, S1541    | Eliminates branching |
| Named Constant     | S1192, S109     | Self-documenting     |
| Memoization        | S4143           | Optimizes re-renders |
| Custom Hook        | S3776, S4144    | Reuses logic         |
| Invert Condition   | S3776, S134     | Reduces nesting      |
| Polymorphism       | S3776           | Type-safe branching  |
| Compose            | S3776           | Pipeline clarity     |
| Nullish Coalescing | S4325           | Handles null safely  |
| Type Guard         | S2589           | Type-safe checks     |

---

## Refactoring Checklist

Before refactoring:

- [ ] Understand the original logic completely
- [ ] Identify the code smell or issue
- [ ] Choose appropriate pattern
- [ ] Plan minimal changes

During refactoring:

- [ ] Apply pattern step by step
- [ ] Preserve all original behavior
- [ ] Keep UI unchanged
- [ ] Maintain type safety

After refactoring:

- [ ] Run tests
- [ ] Verify TypeScript compiles
- [ ] Check SonarQube issue resolved
- [ ] Document changes

---

**Remember:** Choose the simplest pattern that solves the problem. Avoid over-engineering. The goal is cleaner code, not clever code.
