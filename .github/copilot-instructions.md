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
│       ├── hooks/              # Custom hooks
│       ├── api/                # API calls & query functions
│       ├── types/              # Feature types/interfaces
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
- All forms use React Hook Form + Zod.
- All data fetching uses TanStack Query.
- Shared reusable components go inside src/components/shared.
- Feature-specific logic must remain inside its respective feature folder.
