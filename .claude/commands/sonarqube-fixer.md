# SonarQube Fixer

Fix SonarQube issues in React + TypeScript without changing behavior or UI.

---

## Hard Constraints

| NEVER | ALWAYS |
|-------|--------|
| Change UI or visual output | Preserve exact functionality |
| Modify runtime behavior | Keep component interfaces intact |
| Use suppressions (`// NOSONAR`) | Maintain TypeScript type safety |
| Disable rules globally | Pass all existing tests |
| Weaken type safety | Document each change with rule key |

---

## Workflow (5 Phases)

### Phase 1 — Analyze

1. Parse SonarQube report (JSON/HTML/console)
2. List every issue: rule key · severity · file · line
3. Prioritize:

| Priority | Category | Examples |
|----------|----------|----------|
| P0 Critical | Runtime errors | S2589, S4325 |
| P1 High | Major code smells | S3776, S1192, S4143 |
| P2 Medium | Minor smells | S109, S1172 |
| P3 Low | Style improvements | S1125, S3923 |

4. Assess blast radius (components used elsewhere, shared utilities)

### Phase 2 — Plan

Choose minimal safe fix for each issue:

- **S3776, S1541 (Cognitive complexity):** Extract helpers, early returns, simplify booleans
- **S1192, S4144 (Duplicate logic):** Named constants, shared utilities, object maps
- **S4143, S4260 (Hook dependencies):** Add to deps, wrap in useCallback/useMemo
- **S4325, S2589 (Type safety):** Nullish coalescing, type guards, remove redundant checks
- **S109 (Magic numbers):** Named constants with meaning
- **S1481, S1172 (Unused code):** Remove or prefix `_` if interface-required

Confirm: **no behavior change · no interface change · no breaking types**

### Phase 3 — Implement

Fix one issue at a time (P0 → P3). See `.claude/commands/sonarqube-fixer/references/refactoring-patterns.md` for 12 patterns with before/after code.

After each fix:
- Logic preserved ✓
- Types intact ✓
- No UI change ✓

### Phase 4 — Verify

```bash
npm run typecheck
npx eslint app/
```

Checklist:
- [ ] No visual / UI changes
- [ ] Logic preserved
- [ ] Interfaces unchanged
- [ ] No new TypeScript errors
- [ ] No new issues introduced

### Phase 5 — Document

```markdown
# SonarQube Fixes

## Summary
Files modified: X | Issues fixed: Y | Remaining: Z

## Fixes

### S3776 — Cognitive Complexity
Files: DataTable.tsx, Dashboard.tsx
Change: Extracted helpers, early returns
Result: 28→8, 22→12 | Behavior: ✅ unchanged

### S1192 — Duplicate String Literals
Files: api.ts
Change: Extracted constants, updated calls
Result: 8 duplicates eliminated

## Deferred
- S109 config.ts:45 (sprint 3)
```

---

## Reference Files

- `.claude/commands/sonarqube-fixer/references/refactoring-patterns.md` — 12 patterns with code
- `.claude/commands/sonarqube-fixer/references/rules-reference.md` — All common rules with fixes

---

**Goal:** Cleaner code. When behavior vs. rule conflict: **always preserve behavior**.
