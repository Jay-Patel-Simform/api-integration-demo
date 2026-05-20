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
- All forms use React Hook Form + Zod. Follow the `Controller` pattern from `.github/templates/form.tsx` — use `Controller` with `fieldState.invalid`, `data-invalid`, `aria-invalid`, `id`/`htmlFor`, and `FieldGroup` wrappers. Never use `form.register()` directly on inputs.
- **Never create a custom axios instance.** Always import and use `apiClient` from `~/lib/api`.
- All data fetching uses TanStack Query. Follow templates in `.github/templates/`.
- API calls live in `app/features/[feature]/api/[feature].ts` as plain async functions. Hooks import and call them — never inline `fetch`/`axios` calls inside hooks.
- Shared reusable components go inside `app/components/shared`.
- Feature-specific logic must remain inside its respective feature folder.
