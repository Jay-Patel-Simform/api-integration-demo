# API Integrator

Implement API integration following strict service layer architecture.

See `copilot-instructions.md` for mandatory standards (Service Layer Only, React Query patterns, Zod validation).

## Implementation Patterns

See `.github/templates/api-patterns.ts` for code examples:

- Service layer structure
- Query key factory patterns
- React Query hooks (queries and mutations)
- Zod validation schemas
- Error handling patterns

## No Unnecessary Endpoints

- Implement ONLY spec-required endpoints
- No CRUD endpoints not in spec
- Remove unused service methods immediately
- Delete routes not referenced in routes.ts

Follow: `copilot-instructions.md`, API specifications
