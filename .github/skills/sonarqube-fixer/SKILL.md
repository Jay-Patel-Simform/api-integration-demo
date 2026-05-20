---
name: sonarqube-fixer
description: "Fix SonarQube code quality issues in React/TypeScript projects. Use when: addressing code smells, reducing cognitive complexity, fixing maintainability issues, resolving bugs flagged by SonarQube, refactoring complex functions, removing duplicate logic, fixing hook dependencies, or improving type safety. Preserves behavior and UI while improving code quality."
argument-hint: "Rule key (e.g., S3776) or file path to fix"
user-invocable: true
---

# SonarQube Fixer

Fix SonarQube issues in React + TypeScript without changing behavior or UI.

## Trigger Keywords

Code smell · cognitive complexity · hook dependency · duplicate logic · type safety · magic number · unused variable · maintainability · refactor · SonarQube · S3776 · S1192 · S4143 · S109

---

## Hard Constraints

| NEVER                                    | ALWAYS                             |
| ---------------------------------------- | ---------------------------------- |
| Change UI or visual output               | Preserve exact functionality       |
| Modify runtime behavior / business logic | Keep component interfaces intact   |
| Use `// NOSONAR` or rule suppressions    | Maintain TypeScript type safety    |
| Disable rules globally or locally        | Pass all existing tests            |
| Weaken type safety                       | Document each change with rule key |

---

## Workflow (5 Phases)

### Phase 1 — Analyze

1. Parse the SonarQube report (JSON, HTML, or console output).
2. List every issue: rule key · severity · file · line.
3. Prioritize:

| Priority    | Category                    | Examples            |
| ----------- | --------------------------- | ------------------- |
| P0 Critical | Bugs causing runtime errors | S2589, S4325        |
| P1 High     | Major code smells           | S3776, S1192, S4143 |
| P2 Medium   | Minor smells                | S109, S1172         |
| P3 Low      | Style / minor improvements  | S1125, S3923        |

4. Assess blast radius — components used elsewhere, shared utilities.

**Deliverable:**

```
## Issues Found
### P0 — Critical Bugs
- S2589  Dashboard.tsx:45  Boolean expression always true
- S4325  UserForm.tsx:78   Unsafe optional chaining

### P1 — High Priority
- S3776  DataTable.tsx:120  Cognitive complexity 28 (limit 15)
- S1192  utils/format.ts:23  String literal duplicated 5×
```

---

### Phase 2 — Plan

For each issue choose the minimal safe fix:

| Issue Type                          | Strategy                                                     |
| ----------------------------------- | ------------------------------------------------------------ |
| Cognitive complexity (S3776, S1541) | Extract helpers, use early returns, simplify booleans        |
| Duplicate logic (S1192, S4144)      | Named constants, shared utilities, object maps               |
| Hook dependencies (S4143, S4260)    | Add to dep array, wrap in `useCallback`/`useMemo`            |
| Type safety (S4325, S2589)          | Nullish coalescing, type guards, remove redundant conditions |
| Magic numbers (S109)                | Named constants with documented meaning                      |
| Unused code (S1481, S1172)          | Remove; prefix with `_` if interface-required                |

Confirm for every planned change: **no behavior change · no interface change · no breaking types**.

---

### Phase 3 — Implement

Fix one issue at a time in priority order (P0 → P3). After each fix, confirm:

- Logic preserved ✓
- Types intact ✓
- No UI change ✓

**Key patterns (see `references/refactoring-patterns.md` for full examples):**

```tsx
// S3776 — Extract + early return
function processData(data: Data[], filter: string): ProcessedData[] {
  return data.filter(item => isEligible(item, filter)).map(item => ({ ...item, processed: true }))
}
function isEligible(item: Data, filter: string): boolean {
  if (!item.active || item.score <= 50) return false
  return !filter || item.name.includes(filter)
}

// S1192 — Named constant
const API_BASE_URL = 'https://api.example.com/v1'
fetch(`${API_BASE_URL}/users`)

// S4143 — Fix hook dependency
useEffect(() => { fetchData(userId) }, [userId])  // was []

// S4325 — Nullish coalescing
const name = user?.profile?.name ?? 'Guest'  // was ||

// S109 — Named constant
const MS_PER_DAY = 24 * 60 * 60 * 1000
const cacheExpiry = Date.now() + MS_PER_DAY
```

**Deliverable (per fix):**

```
✅ Fixed S3776 — DataTable.tsx
   Extracted renderRow(), getFilteredData(), getSortedData()
   Complexity: 28 → 8 | Behavior: unchanged
```

---

### Phase 4 — Verify

```bash
npm run test          # all existing tests must pass
npm run type-check    # zero TypeScript errors
```

Checklist:

- [ ] No visual / UI changes
- [ ] All original logic preserved
- [ ] Component props / interfaces unchanged
- [ ] No new TypeScript errors
- [ ] SonarQube re-scan shows issues resolved
- [ ] No new issues introduced

---

### Phase 5 — Document

```markdown
# SonarQube Fixes

## Summary

Files modified: 5 | Issues fixed: 12 | Remaining: 3 (P3, deferred)

## Fixes

### S3776 — Cognitive Complexity

Files: DataTable.tsx, Dashboard.tsx
Change: Extracted helper functions, used early returns
Result: Complexity 28→8 (DataTable), 22→12 (Dashboard) | Behavior: ✅ unchanged

### S1192 — Duplicate String Literals

Files: api.ts, utils/fetch.ts
Change: Extracted API_BASE_URL constant, updated 8 fetch calls
Result: 8 duplicates eliminated | Behavior: ✅ unchanged

## Deferred

- S109 config.ts:45 Magic number (sprint 3)
- S138 report.ts:200 Function too long (needs design discussion)
```

---

## Quick Invocation Examples

```
/sonarqube-fixer src/components/Dashboard.tsx
/sonarqube-fixer S3776
/sonarqube-fixer all critical issues
```

## Reference Files

- `references/refactoring-patterns.md` — 12 patterns with before/after code
- `references/rules-reference.md` — All common rules with fix strategies

---

**Goal:** Cleaner, more maintainable code. When behavior vs. rule conflicts, **always preserve behavior**.
