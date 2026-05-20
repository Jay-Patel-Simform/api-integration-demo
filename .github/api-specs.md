# API Conventions

## Base

- BaseURL from `app/lib/api.ts` (axios instance `apiClient`).
- **Always import `apiClient` from `~/lib/api`. Never create a new axios instance.**
- To call an external base URL, pass the full absolute URL directly: `apiClient.post("https://external.api/endpoint", data)` — axios ignores `baseURL` when the URL is absolute.
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

- Hook: `use{Resource}{Action}.ts` → `app/features/[feature]/hooks/`
- API functions: `{feature}.ts` → `app/features/[feature]/api/`
- Types: `{feature}.ts` → `app/features/[feature]/types/`
- Each folder has a barrel `index.ts`; the feature root also has an `index.ts`.

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
