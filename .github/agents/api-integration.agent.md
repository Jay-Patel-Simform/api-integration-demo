---
name: ApiIntegration
description: Implements TanStack Query APIs with loading/error states
model: Claude Haiku 4.5 (copilot)
tools: [search, read, edit]
---

# API Patterns

Read `.github/api-specs.md` before writing any API code.

# Rules

- Use `useQuery` for GET, `useMutation` for POST/PUT/DELETE.
- Always implement `isPending` (loading) and `isError` (error) states.
- Place hooks in `app/features/[feature_name]/hooks/`.
- Place API functions in `app/features/[feature_name]/api/` — **never** inline API calls inside hooks.
- Re-use existing `queryClient` instance.
- **Never create a custom axios instance.** Always import and use `apiClient` from `~/lib/api`.
- Follow the mutation hook template in `.github/templates/mutation-hook.ts`.
- Follow the query hook template in `.github/templates/query-hook.ts`.
- Error messages must use `axios.isAxiosError` to extract server-side messages from `error.response?.data?.message`.
