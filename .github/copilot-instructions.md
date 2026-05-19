# Frontend Standards

## Architecture

- Folder Structure (follow the Bulletproof React Architecture)

- app/
  - components/
    - ui/ # shadcn/ui components
    - shared/ # components used across multiple features
  - lib/ # shared utilities and services
  - routes/ # route components
  - features/
    - dashboard/
      - components/ # feature-specific components
      - hooks/ # feature-specific hooks
      - services/ # API calls for the feature
      - config/ # configuration files for the feature
      - types / # types for the feature
      - index.ts # entry point for the feature
- Feature Based folders
- No Inline types
- No API Calls in the components, use a service layer for API calls
- Types: No 'any' type, use specific types or interfaces. Use TypeScript's utility types where appropriate (e.g., Partial, Pick, Omit)

## React Query

- Use query key factory
- Use queryOptions pattern
- Mutations invalidate parent list / query
- Handle Loading and Error states in the UI

## Forms

- **React Hook Form + Zod**: All forms use React Hook Form with Zod validation via `zodResolver`
- **Controller Pattern (REQUIRED)**: See `.github/templates/form-template-with-hook-form.tsx` for full example
- **Field Component Structure**: Use `<Field>`, `<FieldLabel>`, `<FieldError>` components (see template)
- **Error Handling**: Use `<FieldError>` component only. Never use inline error `<span>` elements
- **Zod Schemas**: Define all validation schemas in `features/[feature]/types/index.ts`

## Components

- **Max 300 Lines**: Strict limit per component file
- **No "use client" Directive**: This is a React Router project, not Next.js. Never add "use client" to any component
- **Extract Reusable Logic**: Pull complex logic into custom hooks (e.g., `useFormState`, `useSearch`)
- **Separate Container/Presentational**: Keep data fetching separate from UI rendering
- **Use shadcn/ui Components**: Leverage existing component library instead of creating custom components
- **Tailwind CSS Only**: No inline styles or CSS modules
- **Avoid Navigation in Column Cells**: Keep DataTable columns simple; don't add navigation links within table cells

## API Integration

- **Service Layer Only**: All API calls must be in `features/[feature]/services/index.ts`, never in components
- **Axios Client**: Use the configured axios instance from `lib/api.ts` with base URL from environment variables
- **No Raw Responses**: Transform API responses in service layer before returning to hooks

## React Router (Not Next.js)

- **No SSR/Server Components**: No "use client" directives needed
- **File-based Routes**: Use manual route configuration in `app/routes.ts`
- **Route Structure**: Keep routes aligned with feature structure
  ```tsx
  route("feature", "routes/feature/layout.tsx", [
    index("routes/feature/index.tsx"),
    route("add", "routes/feature/add.tsx"),
  ])
  ```

## Default Behaviors (no need to specify)

- All async actions show loading state
- All errors are user-friendly (no raw API messages)
- All forms have Submit button
- All mutations invalidate relevant queries using query key factory
- All DataTable columns are right-aligned for numbers, left-aligned for text
