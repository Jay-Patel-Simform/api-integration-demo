# Stack

React 19, React Router 7, Tailwind CSS, Shadcn/ui, React Hook Form, TanStack Query v5, TypeScript.

# Folder Structure

```bash
src/
│
├── components/
│   ├── ui/                     # Shadcn/ui components
│   └── shared/                 # Shared reusable components
│
├── features/
│   └── [feature-name]/
│       ├── components/         # Feature-specific UI components
│       ├── hooks/
              -use${featureName}.ts
              - index.ts
         # Custom hooks
│       ├── api/
              -${featureName}.ts
              -index.ts               # API calls & query functions
│       ├── types/
            - ${featureName}.ts
            # Feature types/interfaces
│       └── index.ts            # Feature exports
│
├── lib/                        # Utilities, configs, helpers
│
├── routes/                     # React Router route modules
│
├── hooks/                      # Global reusable hooks
│
├── types/                      # Global types
│
├── providers/                  # App providers
│
├── layouts/                    # Application layouts
│
├── routes.ts
└── root.tsx
```

# Rules

- Prefer Shadcn/ui components over custom ones.
- **Never create a custom axios instance.** Always import and use `apiClient` from `~/lib/api`.
- All forms use React Hook Form + Zod. Follow the `Controller` pattern from `.github/templates/form.tsx` — use `Controller` with `fieldState.invalid`, `data-invalid`, `aria-invalid`, `id`/`htmlFor`, and `FieldGroup` wrappers. Never use `form.register()` directly on inputs.
- All data fetching uses TanStack Query. Follow templates in `.github/templates/`. Use `useQuery` for GET, `useMutation` for POST/PUT/DELETE. Always implement `isPending` (loading) and `isError` (error) states.
- API calls live in `app/features/[feature]/api/[feature].ts` as plain async functions. Hooks import and call them — never inline `fetch`/`axios` calls inside hooks or UI components.
- Error messages must use `axios.isAxiosError` to extract server-side messages from `error.response?.data?.message`.
- Reuse existing `queryClient` instance from `~/lib/query-client.ts`.
- Shared reusable components go inside `app/components/shared`.
- Feature-specific logic must remain inside its respective feature folder.
- **Use relative API paths only.** Since `apiClient` already has a `baseURL` configured, use relative paths (e.g., `/auth/login`) instead of full endpoint URLs in API calls.
