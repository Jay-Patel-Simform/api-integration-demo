# SonarQube Rules Reference

React + TypeScript. Jump to a rule or browse by category.

---

## Master Table

| Rule                                                | Description                 | Threshold | Severity | Fix                              |
| --------------------------------------------------- | --------------------------- | --------- | -------- | -------------------------------- |
| [S3776](#s3776--cognitive-complexity)               | Cognitive complexity        | 15        | Major    | Extract functions, early returns |
| [S1541](#s1541--function-too-complex)               | Cyclomatic complexity       | 15–20     | Major    | Split function                   |
| [S134](#s134--nested-too-deeply)                    | Nested depth                | 3 levels  | Major    | Early returns, extract           |
| [S1192](#s1192--duplicate-string-literals)          | Duplicate string literals   | 3×        | Major    | Named constant                   |
| [S4144](#s4144--duplicate-function-implementations) | Duplicate functions         | —         | Major    | Merge with params / generics     |
| [S4143](#s4143--missing-hook-dependencies)          | Missing useEffect dep       | —         | Major    | Add to dep array                 |
| [S4260](#s4260--function-defined-inside-loop)       | Function in loop            | —         | Major    | Move outside loop                |
| [S4325](#s4325--unsafe-optional-chaining)           | `\|\|` instead of `??`      | —         | Critical | Use nullish coalescing           |
| [S2589](#s2589--gratuitous-boolean-expression)      | Always-true/false condition | —         | Critical | Remove redundant check           |
| [S1125](#s1125--redundant-boolean-literal)          | `=== true` / `=== false`    | —         | Minor    | Use value directly               |
| [S109](#s109--magic-numbers)                        | Magic numbers               | —         | Minor    | Named constant                   |
| [S1481](#s1481--unused-local-variable)              | Unused variable             | —         | Minor    | Remove or prefix `_`             |
| [S1172](#s1172--unused-parameter)                   | Unused parameter            | —         | Minor    | Remove or prefix `_`             |
| [S1128](#s1128--unused-import)                      | Unused import               | —         | Minor    | Delete import                    |
| [S1067](#s1067--complex-expression)                 | Complex boolean expr        | 3 ops     | Minor    | Extract variables                |
| [S3923](#s3923--use-strict-equality)                | `==` instead of `===`       | —         | Major    | Strict equality                  |

---

## Complexity Rules

### S3776 — Cognitive Complexity

Limit: **15**. Measures how hard code is to understand (not just branch count).

**Common causes:** deeply nested conditionals · complex boolean chains · long switch statements.

```tsx
// ❌ Complexity: 23
function validateUser(user: User, rules: Rules) {
  if (user) {
    if (user.email) {
      if (rules.emailRequired) {
        if (!user.email.includes('@')) return false
      }
    }
    if (user.age) {
      if (rules.ageMin) {
        if (user.age < rules.ageMin) return false
      }
    }
  }
  return true
}

// ✅ Complexity: 6
function validateUser(user: User | null, rules: Rules): boolean {
  if (!user) return true
  return validateEmail(user.email, rules.emailRequired) &&
         validateAge(user.age, rules.ageMin)
}
function validateEmail(email: string | undefined, required: boolean): boolean {
  if (!required || !email) return !required
  return email.includes('@')
}
function validateAge(age: number | undefined, min: number | undefined): boolean {
  if (!min || !age) return true
  return age >= min
}
```

---

### S1541 — Function Too Complex

Cyclomatic complexity > 15–20. **Fix:** split into smaller single-responsibility functions.

---

### S134 — Nested Too Deeply

Max 3 levels. **Fix:** early returns / `continue` in loops / extract nested block to function.

```tsx
// ❌ 4 levels
for (const item of items) {
  if (item.active) {
    if (item.validated) {
      if (item.score > 50) { /* process */ }
    }
  }
}

// ✅ Flat
for (const item of items) {
  if (!item.active || !item.validated || item.score <= 50) continue
  // process
}
```

---

## Duplication Rules

### S1192 — Duplicate String Literals

3+ occurrences. **Fix:** extract constant; group related ones in a config object.

```tsx
// ❌
fetch('https://api.example.com/v1/users')
fetch('https://api.example.com/v1/products')

// ✅
const API = 'https://api.example.com/v1'
fetch(`${API}/users`)
fetch(`${API}/products`)
```

---

### S4144 — Duplicate Function Implementations

**Fix:** merge with parameters or generics.

```tsx
// ❌
function formatUserName(u: User)   { return `${u.firstName} ${u.lastName}`.trim() }
function formatAdminName(a: Admin) { return `${a.firstName} ${a.lastName}`.trim() }

// ✅
function formatFullName(p: { firstName: string; lastName: string }) {
  return `${p.firstName} ${p.lastName}`.trim()
}
```

---

## React Hook Rules

### S4143 — Missing Hook Dependencies

```tsx
// ❌ userId used but not in dep array
useEffect(() => { fetchUser(userId).then(setUser) }, [])

// ✅
useEffect(() => { fetchUser(userId).then(setUser) }, [userId])

// If fetchData causes the dep issue, memoize it
const fetchData = useCallback((id: string) => { /* ... */ }, [])
```

---

### S4260 — Function Defined Inside Loop

```tsx
// ❌ New function each iteration
items.map((item) => {
  function handleClick() { selectItem(item.id) }
  return <button onClick={handleClick}>{item.name}</button>
})

// ✅ Arrow function (React handles identity)
items.map((item) => (
  <button onClick={() => selectItem(item.id)}>{item.name}</button>
))

// ✅ Best — extracted component
function ItemButton({ item, onSelect }: Props) {
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>
}
```

---

## Type Safety Rules

### S4325 — Unsafe Optional Chaining

`||` treats `0`, `''`, `false` as null. Use `??` for null/undefined defaults only.

```tsx
// ❌ Bug: length of 0 becomes 0... actually fine, but name '' becomes 'Guest'
const name   = user?.name   || 'Guest'   // '' → 'Guest' (wrong!)
const count  = data?.count  || 10        // 0  → 10      (wrong!)

// ✅
const name  = user?.name  ?? 'Guest'
const count = data?.count ?? 10
```

---

### S2589 — Gratuitous Boolean Expression

Condition always evaluates to true or false.

```tsx
// ❌ items truthy check is redundant after .length > 0
if (items.length > 0 && items) { }

// ✅
if (items.length > 0) { }

// ❌ Boolean is always true or false — no need to compare
if (value === true || value === false) { }

// ✅ (check for existence instead)
if (value !== undefined) { }
```

---

### S1125 — Redundant Boolean Literal

```tsx
// ❌
if (isActive === true)  { }
if (isDisabled === false) { }

// ✅
if (isActive)   { }
if (!isDisabled) { }
```

---

## Variable & Function Rules

### S109 — Magic Numbers

```tsx
// ❌
const cache = Date.now() + 86400000
if (score > 0.75) { }

// ✅
const MS_PER_DAY    = 24 * 60 * 60 * 1000
const PASSING_SCORE = 0.75

const cache = Date.now() + MS_PER_DAY
if (score > PASSING_SCORE) { }
```

---

### S1481 — Unused Local Variable

```tsx
// ❌
function Component() {
  const [count, setCount] = useState(0)  // count never read
  return <button onClick={() => setCount(c => c + 1)}>+</button>
}

// ✅
function Component() {
  const [, setCount] = useState(0)  // destructure without name
  return <button onClick={() => setCount(c => c + 1)}>+</button>
}
```

---

### S1172 — Unused Parameter

```tsx
// ❌
function formatUser(user: User, options: Options) {
  return user.name  // options never used
}

// ✅ — remove if not interface-required
function formatUser(user: User) { return user.name }

// ✅ — prefix _ if required by interface
class UserFormatter implements Formatter {
  format(user: User, _options: Options) { return user.name }
}
```

---

### S1128 — Unused Import

Delete the import line. Most editors and ESLint auto-detect this.

```tsx
// ❌
import { useState, useEffect } from 'react'  // useEffect never used

// ✅
import { useState } from 'react'
```

---

## Conditional Rules

### S1067 — Complex Expression

Max 3 operators. **Fix:** extract to named booleans or a helper function.

```tsx
// ❌ 5 operators
if ((user.role === 'admin' || user.role === 'moderator') &&
    user.active && !user.suspended && user.verified &&
    (user.level > 5 || user.trusted)) { }

// ✅ Named variables
const isPrivileged = user.role === 'admin' || user.role === 'moderator'
const isActive     = user.active && !user.suspended && user.verified
const hasAccess    = user.level > 5 || user.trusted

if (isPrivileged && isActive && hasAccess) { }

// ✅ Better — predicate function
if (canPerformAction(user)) { }
```

---

### S3923 — Use Strict Equality

```tsx
// ❌
if (value == '0')  { }
if (value != null) { }

// ✅
if (value === '0')  { }
if (value !== null) { }
```

---

## Severity Reference

| Severity     | Fix When       | Examples                                |
| ------------ | -------------- | --------------------------------------- |
| **Blocker**  | Before release | Security vulnerabilities, critical bugs |
| **Critical** | ASAP           | S2589, S4325                            |
| **Major**    | Current sprint | S3776, S1192, S4143, S3923              |
| **Minor**    | Backlog        | S109, S1481, S1128, S1125               |

---

Full rule docs: [rules.sonarsource.com/typescript](https://rules.sonarsource.com/typescript)
