# React Component Refactoring

Decompose complex React components into smaller, maintainable pieces without breaking functionality.

---

## Loading Strategy

**Progressive Disclosure:** Do NOT read reference files at startup. Load one at a time only when entering Phase 3 for a specific extraction. Re-read Phase 1 table if unsure which reference applies.

---

## Phase 1 — Analyse

Read entire file before extracting. Identify extraction type:

| Signal | Extraction Type |
|--------|-----------------|
| Self-contained JSX block (header, card, list item) | Split component |
| Data fetching mixed with rendering | Split component |
| Filter/sort/derive logic, reusable state | Extract custom hook |
| Loading/error/empty pattern repeated 2+ places | Extract shared/utility UI |
| Shared layout shell (sidebar, page wrapper) | Extract shared/utility UI |
| Expensive renders, stable props, unnecessary re-renders | Add memoization |
| Data-table / listing page | Listing page patterns |

For each candidate: note state needed, callbacks, Context consumption.

---

## Phase 2 — Plan

Prioritize: hooks first (fewest JSX deps) → presentational → containers → shared UI

**File placement:**
- Feature component: `app/features/[feature]/components/`
- Shared UI: `app/components/shared/`
- Custom hook: `app/features/[feature]/hooks/` or `app/hooks/`
- Layout: `app/components/layouts/`

**Co-locate tightly coupled pieces:**
```
UserProfile/
  index.ts
  UserProfile.tsx
  UserProfileHeader.tsx
  useUserData.ts
```

**Prop API rule:** ≤ 8 props per component (group related props into objects if exceeding).

---

## Phase 3 — Implement

Extract one thing at a time. Before writing code, read the matching reference file:

| Extraction Type | Read Reference File |
|-----------------|-------------------|
| Split component or separate container/presentation | `.claude/commands/react-component-refactor/references/split-component.md` |
| Extract custom hook | `.claude/commands/react-component-refactor/references/extract-hook.md` |
| Extract shared/utility UI | `.claude/commands/react-component-refactor/references/extract-ui.md` |
| Add memoization | `.claude/commands/react-component-refactor/references/memoization.md` |
| Data-table / listing page | `.claude/commands/react-component-refactor/references/listing-page-patterns.md` |

Follow reference steps exactly. Do not invent from memory.

---

## Phase 4 — Verify

```bash
npm run typecheck
```

Check:
- [ ] Renders correctly
- [ ] All interactions work (clicks, inputs, form submit)
- [ ] Loading/error states display
- [ ] No new console warnings
- [ ] No re-render regressions

**Target metrics:**
- Parent: < 200 lines (< 50% of original)
- Each extracted piece: < 150 lines
- Props per component: ≤ 8
- JSX nesting depth: ≤ 4 levels

---

## Phase 5 — Output

```markdown
### Refactoring Summary
Original: ComponentName.tsx — X lines, N responsibilities

| File | Lines | Responsibility |
|------|-------|-----------------|
| ParentComponent.tsx | X | Orchestration |
| SubComponent.tsx | X | Presentation |
| hooks/useX.ts | X | Logic |

### Verification
- [ ] TypeScript compiles
- [ ] Functionality preserved
- [ ] No new warnings

### Test Scenarios
1. (list scenarios)
2. (list scenarios)

### Deferred
- (any not-yet-extracted patterns)
```

---

## When NOT to Refactor

- Component < 150 lines with single responsibility
- Extraction requires prop-drilling 3+ levels (use Context instead)
- Component scheduled for deletion/full rewrite
- Performance acceptable, no excessive re-renders
