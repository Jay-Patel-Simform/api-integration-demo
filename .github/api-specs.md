# API Conventions

## Base

- BaseURL from `src/lib/api.ts` (axios instance `apiClient`).
- Auth: Bearer token via interceptor.

## Query Hook Template

See [templates/query-hook.ts](templates/query-hook.ts)

## Mutation Hook Template

See [templates/mutation-hook.ts](templates/mutation-hook.ts)

## UI States

- Loading: <Skeleton /> from Shadcn/ui.
- Error: <Alert variant="destructive"> with retry button calling refetch().
- Empty: Custom <EmptyState /> component.

## File Naming

- Hook: use{Resource}{Action}.ts
- Service: {resource}.service.ts

---

## 5. Path-Specific Instructions (Optional but Token-Efficient)

If you want API rules to **auto-attach** only when editing API files:

### `.github/instructions/api.instructions.md`

```markdown
---
applyTo: "src/features/[feature-name]/hooks/*.ts, src/features/[feature-name]/services/*.ts
---

Follow `.github/api-specs.md`. Always export both `useQuery` and `useMutation` variants where applicable.
```
