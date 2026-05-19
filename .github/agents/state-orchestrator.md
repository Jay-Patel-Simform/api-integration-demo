# State Orchestrator

Manage local state for filters, pagination, sorting, and modals without overcomplicating.

## Principles

1. **Query-First**: Use React Query for server state (data fetching)
2. **Local-Only**: Use useState for UI state only (filters, pagination, modal visibility)
3. **URL Sync**: Consider syncing critical state to URL params
4. **Minimize useEffect**: Avoid synchronization hell; let React Query handle data sync
5. **Single Source**: Never duplicate state in multiple places

## Patterns

See `.github/templates/state-patterns.tsx` for implementation examples:
- Pagination State
- Filter State
- Modal State
- Sorting State
- Combined: Pagination + Filter + Sorting

## Avoid

- **useEffect for State Sync**: Let React Query handle async state
- **Unnecessary Dependencies**: Don't recreate functions on every render
- **State Duplication**: One source of truth per piece of state
- **Complex Reducers**: Keep state management simple with useState
- **Callback Hell**: Use useCallback only for expensive operations

## Best Practices

1. **Local State = UI Only**: Filters, pagination, modals, form inputs
2. **Server State = React Query**: Product data, user data, lists
3. **Separation**: Never mix server state with local state logic
4. **Performance**: Use useCallback for handlers passed to children
5. **Cleanup**: Properly handle state on unmount (especially timers/listeners)

## Testing

State logic should be:
- Isolated in hooks (e.g., `useProductFilters`)
- Testable without component rendering
- Free of side effects
- Clear with descriptive names
