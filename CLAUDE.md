# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # Generate React Router types + TypeScript check
npm run format     # Prettier format
```

There is no test runner configured.

## Architecture

This is a **React Router 7** (full-stack, SSR) app with file-based routing. The stack is:
- **React Query** for all server state (no Redux/Zustand)
- **Axios** with a shared `apiClient` in [app/lib/api.ts](app/lib/api.ts) — request interceptor injects the Bearer token, response interceptor redirects to `/login` on 401
- **React Hook Form + Zod** for forms; Zod schemas are the single source of truth for both types and validation
- **shadcn/ui** (Tailwind + Radix primitives) for UI components

### Feature-based structure

Features live in `app/features/<name>/` and are self-contained:

```
features/
  auth/
    api/       ← raw axios calls
    hooks/     ← React Query wrappers (useQuery / useMutation)
    types/     ← Zod schemas + inferred TS types
    index.ts   ← barrel export (only public surface)
  dashboard/
    products/
      api/
      hooks/
      types/
      components/
      index.ts
```

Import features via their barrel: `import { useProducts } from "~/features/dashboard/products"`.

### Data flow

Route component → custom hook (React Query) → feature `api/` function → `apiClient` (Axios) → external API.

Mutations call `queryClient.invalidateQueries` on success to keep the cache consistent.

### Routing

Routes are declared in [app/routes.ts](app/routes.ts) and map to files under [app/routes/](app/routes/). The `~/*` tsconfig alias points to the `app/` folder.

React Router generates types into `.react-router/` — run `npm run typecheck` after adding routes.

## Key conventions

- **No semicolons**, double quotes, 80-char line width (Prettier enforces this)
- **No `console.log`** — only `console.warn` / `console.error` allowed (ESLint)
- **Strict TypeScript**: no `any`, explicit return types required, no floating promises
- **URL-based filter state**: search/filter params live in `searchParams`, not component state
- **Auth tokens**: `accessToken` and `refreshToken` stored in `localStorage`
- **Pagination default**: 10 items per page
- **Search debounce**: 300 ms
- **Import alias**: `~/` maps to `app/`

## Adding a new feature

1. Create `app/features/<name>/{api,hooks,types,components}/` folders
2. Define Zod schemas in `types/` and infer TypeScript types from them
3. Write raw API functions in `api/` using `apiClient`
4. Wrap with React Query in `hooks/` (invalidate related queries in mutation `onSuccess`)
5. Re-export everything through `index.ts`
6. Register the route in `app/routes.ts`

## API conventions

- **Never create a new axios instance.** Always import `apiClient` from `~/lib/api`.
- Bearer token is injected automatically by the request interceptor.
- Use relative paths in `apiClient` calls (e.g., `/auth/login`) — the `baseURL` is already set.
- To call an external absolute URL, pass it directly; axios ignores `baseURL` for absolute URLs.
- Error messages must use `axios.isAxiosError()` to extract server-side messages from `error.response?.data?.message`.
- Always reuse the `queryClient` instance from `~/lib/query-client.ts` — never create a new one.
- **Template files:** see `.claude/templates/` for `query-hook.ts`, `mutation-hook.ts`, and `form.tsx` patterns.

## React form conventions

- Use **React Hook Form** with the `Controller` pattern for all forms.
- Define validation schemas with **Zod** in `app/features/[feature]/types/`.
- Use the `Field`, `FieldLabel`, `FieldError`, `FieldGroup` components from `~/components/ui/field.tsx`.
- Pattern template: see `.claude/templates/form.tsx`.

## Listing page patterns

For data table / listing pages, consult `.claude/commands/react-component-refactor/references/listing-page-patterns.md`.
