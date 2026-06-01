---
name: react-component-refactor
description: >
  Refactor complex React components into smaller, maintainable, reusable pieces.
  Trigger whenever a component is over ~300 lines, mixes data-fetching with rendering,
  has deeply nested JSX (3+ levels), repeats UI patterns, or the user says things like
  "this component is too big", "break this down", "extract a hook", "clean up this file",
  or "it's hard to maintain/test". Also trigger for performance issues like excessive
  re-renders or requests to memoize. Follows bulletproof-react architecture with
  React Query (server state), react-hook-form (forms), and Zod (validation).
argument-hint: "Path to the React component file to refactor"
user-invocable: true
---

# React Component Refactoring

Systematic workflow for decomposing a complex React component without breaking functionality.

---

## Loading Strategy (Token Efficiency)

> **Progressive Disclosure — follow these rules to minimise token usage:**
>
> - **Do NOT read any `references/` file at startup.** Load them only when entering Phase 3 for a specific extraction.
> - Load **one reference file at a time**, only for the extraction type you are about to implement.
> - Re-read the Phase 1 signal table if unsure which reference applies — never guess and never load all.
> - `listing-page-patterns.md` is only loaded if the component is a data-table / listing page.

---

## Phase 1 — Analyse

Read the **entire file** before extracting anything. Identify:

| Signal                                                  | Extraction type (used in Phase 3)   |
| ------------------------------------------------------- | ----------------------------------- |
| Self-contained JSX block (header, card, list item)      | → Split component                   |
| Data fetching mixed with rendering                      | → Split component                   |
| Filter/sort/derive logic, reusable state                | → Extract custom hook               |
| Loading/error/empty pattern repeated 2+ places          | → Extract shared/utility UI         |
| Shared layout shell (sidebar, page wrapper)             | → Extract shared/utility UI         |
| Expensive renders, stable props, unnecessary re-renders | → Add memoization                   |
| Data-table / listing page                               | → Listing page patterns (load last) |

For each candidate note: which state it needs, which callbacks it calls, whether it consumes Context.

---

## Phase 2 — Plan

Prioritise in this order — hooks first (fewest JSX deps), then presentational, then containers, then shared UI.

**File placement:**
| Type | Location |
|---|---|
| Feature component | `app/features/[feature]/components/` |
| Shared UI primitive | `app/components/shared/` |
| Custom hook | `app/features/[feature]/hooks/` |
| Layout component | `app/components/layouts/` |

Co-locate tightly coupled pieces:

```
UserProfile/
  index.ts
  UserProfile.tsx
  UserProfileHeader.tsx
  useUserData.ts
```

**Prop API rule:** ≤ 8 props per component. If over, group related props into an object.

---

## Phase 3 — Implement

Extract **one thing at a time**. For each extraction, **call `read_file` on the matching reference right now — before writing any code.** Load only one file per extraction cycle; do not pre-load the others.

| Extraction type                                           | Action before coding                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------- |
| Split a component or separate container from presentation | `read_file references/split-component.md` → follow its steps exactly |
| Extract a custom hook                                     | `read_file references/extract-hook.md` → follow its steps exactly    |
| Extract shared/utility UI                                 | `read_file references/extract-ui.md` → follow its steps exactly      |
| Add memoization                                           | `read_file references/memoization.md` → follow its steps exactly     |
| Data-table / listing page patterns                        | `read_file references/listing-page-patterns.md` → only if applicable |

After reading the reference, follow the steps it defines. Do not invent steps from memory.

---

## Phase 4 — Verify

After each extraction:

```bash
npm run lint
```

Check:

- [ ] Renders correctly
- [ ] All interactions work (clicks, inputs, form submit)
- [ ] Loading / error states still display
- [ ] No new console warnings
- [ ] No regressions in re-render behavior
      **Target metrics:**
- Parent: < 200 lines (aim for < 50% of original)
- Each extracted piece: < 150 lines
- Props per component: ≤ 8
- JSX nesting depth: ≤ 4 levels

---

## Phase 5 — Output

```
### 📊 Refactoring Summary
Original: `ComponentName.tsx` — X lines, N responsibilities

| File | Lines | Responsibility |
|---|---|---|
| ParentComponent.tsx | X | Orchestration |
| SubComponent.tsx | X | ... |
| hooks/useX.ts | X | ... |

### ✅ Verification
- [ ] TypeScript compiles
- [ ] All functionality preserved
- [ ] No new warnings

### 📝 Test These Scenarios
1. ...
2. ...

### 🔄 Deferred Opportunities
- ...
```

---

## When NOT to Refactor

Skip if:

- Component is < 150 lines with a single clear responsibility
- Extraction requires prop-drilling through 3+ levels (use Context instead)
- Component is scheduled for deletion or full rewrite
- Performance is acceptable and no excessive re-renders
