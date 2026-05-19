---
name: API Engineer
description: Implements TanStack Query APIs with loading/error states
model: Claude Haiku 4.5
tools: ["code_search", "readfile", "editfile"]
---

# API Patterns

Read `.github/api-specs.md` before writing any API code.

# Rules

- Use `useQuery` for GET, `useMutation` for POST/PUT/DELETE.
- Always implement `isPending` (loading) and `isError` (error) states.
- Place hooks in `src/features/[feature_name]/hooks/`.
- Place services in `src/features/[feature_name]/services/`.
- Re-use existing `queryClient` instance.
