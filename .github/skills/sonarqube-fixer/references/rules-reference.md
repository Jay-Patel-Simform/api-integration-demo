# Common SonarQube Rules Reference

Comprehensive guide to frequently encountered SonarQube rules in React + TypeScript projects.

---

## Complexity Rules

### S3776 - Cognitive Complexity

**Description:** Functions should not have high cognitive complexity.

**Threshold:** Default 15

**Why It Matters:** High complexity makes code hard to understand, test, and maintain.

**Common Causes:**

- Deeply nested conditionals
- Multiple early exits
- Complex boolean logic
- Long switch statements

**Fix Strategies:**

1. Extract helper functions
2. Use early returns
3. Replace nested ifs with guard clauses
4. Simplify boolean expressions
5. Use object maps instead of switch

**Example:**

```tsx
// ❌ Cognitive Complexity: 23
function validateUser(user: User, rules: Rules) {
  if (user) {
    if (user.email) {
      if (rules.emailRequired) {
        if (!user.email.includes('@')) {
          return false
        }
      }
    }
    if (user.age) {
      if (rules.ageMin) {
        if (user.age < rules.ageMin) {
          return false
        }
      }
    }
  }
  return true
}

// ✅ Cognitive Complexity: 6
function validateUser(user: User | null, rules: Rules): boolean {
  if (!user) return true

  const emailValid = validateEmail(user.email, rules.emailRequired)
  const ageValid = validateAge(user.age, rules.ageMin)

  return emailValid && ageValid
}

function validateEmail(email: string | undefined, required: boolean): boolean {
  if (!required) return true
  if (!email) return false
  return email.includes('@')
}

function validateAge(age: number | undefined, minAge: number | undefined): boolean {
  if (!minAge) return true
  if (!age) return false
  return age >= minAge
}
```

---

### S1541 - Functions Should Not Be Too Complex

**Description:** Functions should not have too many lines or branches.

**Threshold:** 15-20 for cyclomatic complexity

**Fix Strategies:**

1. Split into smaller functions
2. Extract related logic into helper functions
3. Use composition over complexity

---

### S134 - Control Flow Statements Should Not Be Nested Too Deeply

**Description:** Nested if/for/while statements reduce readability.

**Threshold:** 3 levels maximum

**Fix Strategies:**

1. Use early returns
2. Extract nested logic to functions
3. Invert conditions

**Example:**

```tsx
// ❌ Nested too deeply
function process(items: Item[]) {
  for (const item of items) {
    if (item.active) {
      if (item.validated) {
        if (item.score > 50) {
          // process item
        }
      }
    }
  }
}

// ✅ Flattened with early continues
function process(items: Item[]) {
  for (const item of items) {
    if (!item.active) continue
    if (!item.validated) continue
    if (item.score <= 50) continue

    // process item
  }
}

// ✅ Better: Extract to filter + map
function process(items: Item[]): ProcessedItem[] {
  return items
    .filter(isEligibleItem)
    .map(processItem)
}
```

---

## Duplication Rules

### S1192 - String Literals Should Not Be Duplicated

**Description:** Define a constant instead of duplicating literals.

**Threshold:** 3+ duplicates

**Fix Strategies:**

1. Extract to named constant
2. Group related constants in config object
3. Use enum for related strings

**Example:**

```tsx
// ❌ Duplicated string literal
fetch('https://api.example.com/users')
fetch('https://api.example.com/products')
fetch('https://api.example.com/orders')

// ✅ Extract constant
const API_BASE_URL = 'https://api.example.com'

fetch(`${API_BASE_URL}/users`)
fetch(`${API_BASE_URL}/products`)
fetch(`${API_BASE_URL}/orders`)
```

---

### S4144 - Functions Should Not Have Identical Implementations

**Description:** Duplicate functions should be refactored into one.

**Fix Strategies:**

1. Extract common function with parameters
2. Use generics for type variations
3. Create shared utility

**Example:**

```tsx
// ❌ Duplicate logic
function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim()
}

function formatAdminName(admin: Admin): string {
  return `${admin.firstName} ${admin.lastName}`.trim()
}

// ✅ Single function
function formatFullName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`.trim()
}

// Usage
formatFullName(user)
formatFullName(admin)
```

---

## React Hook Rules

### S4143 - Collection Elements Should Not Be Replaced Unconditionally

**Description:** React hooks dependency array issues.

**Common Issue:** Missing dependencies in useEffect, useCallback, useMemo

**Fix Strategies:**

1. Add all dependencies to array
2. Use useCallback for function dependencies
3. Use useMemo for computed values

**Example:**

```tsx
// ❌ Missing dependency
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, []) // userId missing!

  return <div>{user?.name}</div>
}

// ✅ All dependencies included
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId]) // ✓ dependency included

  return <div>{user?.name}</div>
}
```

---

### S4260 - Functions Should Not Be Defined Inside Loops

**Description:** Creating functions inside loops is inefficient.

**Fix Strategies:**

1. Move function outside loop
2. Use arrow function with parameters
3. Extract to separate function

**Example:**

```tsx
// ❌ Function created in loop
items.map((item, index) => {
  function handleClick() {
    selectItem(item.id)
  }
  return <button onClick={handleClick}>{item.name}</button>
})

// ✅ Arrow function (React handles optimization)
items.map((item) => (
  <button onClick={() => selectItem(item.id)}>{item.name}</button>
))

// ✅ Best: Extract component
function ItemButton({ item, onSelect }: Props) {
  const handleClick = () => onSelect(item.id)
  return <button onClick={handleClick}>{item.name}</button>
}

items.map((item) => (
  <ItemButton key={item.id} item={item} onSelect={selectItem} />
))
```

---

## Type Safety Rules

### S4325 - Optional Chaining Should Be Used

**Description:** Use nullish coalescing with optional chaining.

**Fix Strategies:**

1. Replace `||` with `??` for null/undefined checks
2. Add optional chaining where null checks exist

**Example:**

```tsx
// ⚠️ Potential bug with falsy values
const name = user?.name || 'Guest'
// Problem: empty string '' would become 'Guest'

// ✅ Correct: Only null/undefined become 'Guest'
const name = user?.name ?? 'Guest'

// ❌ Unsafe optional chaining
const length = user?.items?.length || 0
// Problem: length of 0 would become 0 (but that's the actual value!)

// ✅ Correct
const length = user?.items?.length ?? 0
```

---

### S2589 - Boolean Expressions Should Not Be Gratuitous

**Description:** Remove expressions that always evaluate to true/false.

**Fix Strategies:**

1. Remove redundant conditions
2. Simplify boolean logic
3. Trust type system

**Example:**

```tsx
// ❌ Redundant condition
if (items.length > 0 && items) {
  // items is always truthy here if length > 0
}

// ✅ Simplified
if (items.length > 0) {
  // sufficient
}

// ❌ Always true
if (value === true || value === false) {
  // value is boolean, so always true
}

// ✅ Simplified
// Just use the value directly or check if it exists
if (value !== undefined) {
}
```

---

### S1125 - Boolean Literals Should Not Be Redundant

**Description:** Don't compare booleans to true/false explicitly.

**Example:**

```tsx
// ❌ Redundant comparison
if (isActive === true) {
if (isDisabled === false) {

// ✅ Direct usage
if (isActive) {
if (!isDisabled) {
```

---

## Variable and Function Rules

### S109 - Magic Numbers Should Not Be Used

**Description:** Replace numbers with named constants.

**Fix Strategies:**

1. Extract to named constant
2. Document meaning
3. Group related constants

**Example:**

```tsx
// ❌ Magic numbers
setTimeout(callback, 5000)
const cacheTime = Date.now() + 86400000
if (score > 0.75) {

// ✅ Named constants
const FIVE_SECONDS_MS = 5000
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000
const PASSING_SCORE_THRESHOLD = 0.75

setTimeout(callback, FIVE_SECONDS_MS)
const cacheTime = Date.now() + MILLISECONDS_IN_DAY
if (score > PASSING_SCORE_THRESHOLD) {
```

---

### S1481 - Unused Local Variables Should Be Removed

**Description:** Remove unused variables and imports.

**Fix Strategies:**

1. Remove unused variables
2. Remove unused imports
3. Use `_` prefix for intentionally unused params

**Example:**

```tsx
// ❌ Unused variable
function Component() {
  const [count, setCount] = useState(0) // count never used
  const unused = 123 // never used

  return <button onClick={() => setCount(c => c + 1)}>Click</button>
}

// ✅ Remove unused
function Component() {
  const [, setCount] = useState(0) // _ or omit name

  return <button onClick={() => setCount(c => c + 1)}>Click</button>
}

// ✅ For intentionally unused params
function handleEvent(_event: Event, data: Data) {
  // _event prefix shows it's intentionally unused
  processData(data)
}
```

---

### S1172 - Unused Function Parameters Should Be Removed

**Description:** Remove or document unused parameters.

**Fix Strategies:**

1. Remove if not needed
2. Prefix with `_` if required by interface
3. Document why it's there

**Example:**

```tsx
// ❌ Unused parameter
function formatUser(user: User, options: Options) {
  // options never used
  return user.name
}

// ✅ Remove unused param
function formatUser(user: User) {
  return user.name
}

// ✅ If required by interface
interface Formatter {
  format(user: User, options: Options): string
}

class UserFormatter implements Formatter {
  format(user: User, _options: Options): string {
    // _options shows it's intentionally unused
    return user.name
  }
}
```

---

## Import and Export Rules

### S1128 - Unused Imports Should Be Removed

**Description:** Remove unused imports.

**Fix:** Delete the import line.

```tsx
// ❌ Unused import
import { useState, useEffect } from 'react' // useEffect not used

// ✅ Only import what's used
import { useState } from 'react'
```

---

## Conditional Rules

### S1067 - Expressions Should Not Be Too Complex

**Description:** Complex boolean expressions reduce readability.

**Threshold:** 3 operators maximum

**Fix Strategies:**

1. Extract to named boolean variables
2. Create helper validation functions
3. Use early returns

**Example:**

```tsx
// ❌ Complex expression
if ((user.role === 'admin' || user.role === 'moderator') &&
    user.active &&
    !user.suspended &&
    user.verified &&
    (user.level > 5 || user.trusted)) {
  // allow action
}

// ✅ Extract to variables
const isPrivilegedUser = user.role === 'admin' || user.role === 'moderator'
const isActiveUser = user.active && !user.suspended && user.verified
const hasHighAccess = user.level > 5 || user.trusted

if (isPrivilegedUser && isActiveUser && hasHighAccess) {
  // allow action
}

// ✅ Better: Helper function
if (canPerformAction(user)) {
  // allow action
}

function canPerformAction(user: User): boolean {
  const isPrivilegedUser = ['admin', 'moderator'].includes(user.role)
  const isActiveUser = user.active && !user.suspended && user.verified
  const hasHighAccess = user.level > 5 || user.trusted

  return isPrivilegedUser && isActiveUser && hasHighAccess
}
```

---

### S3923 - "===" Should Be Used Instead of "=="

**Description:** Use strict equality to avoid type coercion bugs.

**Example:**

```tsx
// ❌ Loose equality
if (value == '0') { // type coercion!

// ✅ Strict equality
if (value === '0') {

// ❌ Not equal
if (value != null) {

// ✅ Strict not equal
if (value !== null) {
```

---

## Quick Reference Table

| Rule  | Description          | Common Fix                       |
| ----- | -------------------- | -------------------------------- |
| S3776 | Cognitive Complexity | Extract functions, early returns |
| S1541 | Function too complex | Split into smaller functions     |
| S134  | Nested too deeply    | Early returns, extract functions |
| S1192 | Duplicate strings    | Extract constant                 |
| S4144 | Duplicate functions  | Merge into one with parameters   |
| S4143 | Hook dependencies    | Add to dependency array          |
| S4260 | Function in loop     | Move outside loop                |
| S4325 | Optional chaining    | Use ?? instead of \|\|           |
| S2589 | Gratuitous boolean   | Remove redundant conditions      |
| S1125 | Boolean literal      | Remove === true checks           |
| S109  | Magic numbers        | Named constants                  |
| S1481 | Unused variable      | Remove or use                    |
| S1172 | Unused parameter     | Remove or prefix with \_         |
| S1128 | Unused import        | Remove import                    |
| S1067 | Complex expression   | Extract to variables             |
| S3923 | == instead of ===    | Use strict equality              |

---

## Severity Guidelines

**Blocker:** Must fix before release

- Security vulnerabilities
- Critical bugs

**Critical:** Fix ASAP

- S2589 (always true/false conditions)
- S4325 (unsafe optional chaining)

**Major:** Fix in current sprint

- S3776 (high complexity)
- S1192 (many duplicates)
- S4143 (hook dependencies)

**Minor:** Fix in backlog

- S109 (magic numbers)
- S1481 (unused variables)
- S1128 (unused imports)

---

**Note:** This reference covers the most common rules. For complete rule documentation, visit the [SonarQube Rules Explorer](https://rules.sonarsource.com/typescript).
