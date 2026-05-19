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

## Forms

- Use React Hook Form + Zod
- Use Controller Pattern
- Use Field Component from the shadcn/ui library for form fields

## Components

- Max 300 Line of code per component
- Extract reusable logic to hooks
- Separate Container and Presentational components
- Use shadcn/ui components where possible
- Use Tailwind CSS for styling

## Default Behaviors (no need to specify)

- All async actions show loading state
- All errors are user-friendly (no raw API messages)
- All forms have Submit button
