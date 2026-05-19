# Skill Adaptation Summary

This skill has been adapted to match your project's architecture and conventions.

## Key Changes Made

### 1. **React Query Integration**

- Updated container component examples to use React Query hooks instead of manual `useState` + `useEffect`
- Show patterns using `useProducts()`, `useDeleteProduct()` mutations
- Demonstrate cache invalidation patterns from your actual codebase

### 2. **Project Structure Alignment**

- References updated from generic paths to actual project structure:
  - `app/features/[feature]/components/` for feature-specific components
  - `app/components/ui/` for reusable UI components
  - `app/hooks/` for custom logic hooks
  - `app/routes/` for page components
- Uses `@/` path aliases throughout examples

### 3. **Real Project Components**

- Examples now reference your actual UI components:
  - `Button`, `Input`, `Card`, `Spinner`, `AlertDialog`
- Shows real patterns from your project:
  - `ProductsList`, `ProductCard`, `DeleteProductDialog`
  - Filter/sort logic with `useProductFilters` hook

### 4. **Validation & State Management**

- Emphasizes Zod validation for forms and mutations
- Shows React Hook Form integration where relevant
- Demonstrates proper error handling via `ApiError` and React Query

### 5. **Template Updates**

- **templates.md**: New templates for:
  - Presentational components
  - Container components with React Query
  - Custom hooks for UI state (not API state)
  - Shared UI components
- Each template shows file paths and best practices from your project

### 6. **Practical Examples**

- **examples.md**: Complete before/after refactoring of a ProductsList
- Shows extraction of:
  - `ProductCard` presentational component
  - `ProductsFilters` controls component
  - `DeleteProductDialog` with mutation handling
  - `useProductFilters` custom hook for filter/sort logic
- Demonstrates proper React Query usage with cache invalidation

## When to Use This Skill

Invoke this skill when you need to refactor complex React components in this project. It provides:

1. **Step-by-step guidance** for extracting components
2. **Templates** pre-configured for your tech stack
3. **Real examples** from your codebase
4. **Best practices** for bulletproof-react architecture
5. **File organization** rules for your project

## Key Principles Reinforced

✅ **Separation of Concerns**: Container (data) vs Presentational (UI) components  
✅ **React Query for API State**: All data fetching managed via React Query hooks  
✅ **Custom Hooks for UI Logic**: Only non-API state gets custom hooks  
✅ **Feature-Based Organization**: Group related API, components, types together  
✅ **Type Safety**: Full TypeScript typing on all props and returns  
✅ **Reusability**: Shared UI components in `app/components/ui/`

## References

- [Copilot Instructions](../) - Main project patterns
- [API Query Pattern](../../copilot-instructions.md#5-api-query-pattern) - How to structure API queries
- [Mutation Pattern](../../copilot-instructions.md#6-api-mutation-pattern) - How to structure mutations

---

**Last Updated:** May 2026  
**Adapted By:** GitHub Copilot
