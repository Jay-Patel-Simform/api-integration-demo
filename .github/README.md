# Project Standards & Guidelines

This directory contains strict coding standards, agent configurations, and feature specifications to ensure consistency, reduce back-and-forth communication, and maintain high code quality across the project.

## 📋 Structure

```
.github/
├── agents/              # Agent role definitions
│   ├── api-integrator.md          # API service layer & React Query
│   ├── feature-implementer.md      # Overall feature orchestration
│   ├── form-builder.md             # Form component generation
│   ├── spec-generator.md           # Feature specification generation
│   └── state-orchestrator.md       # State management patterns
├── copilot-instructions.md  # Frontend standards & architecture
├── specs/               # Feature specifications (YAML)
│   ├── products.yaml              # Example: Products feature spec
│   └── responses/                 # API response examples
└── templates/           # Code templates
    ├── form-template-strict.tsx   # REQUIRED form pattern
    ├── form-template-with-hook-form.tsx
    └── query-key-factory.ts
```

## 🎯 Mandatory Standards

### 1. Forms - Controller Pattern (STRICT)

**ALL forms MUST use Controller Pattern with Field component hierarchy:**

```tsx
<Field>
  <FieldLabel>Label *</FieldLabel>
  <FieldContent>
    <Controller
      name="fieldName"
      control={control}
      render={({ field }) => <Input {...field} />}
    />
    {errors.fieldName && <FieldError errors={[errors.fieldName]} />}
  </FieldContent>
</Field>
```

**Why:**

- Consistent error handling across app
- Type-safe field binding
- Proper accessibility attributes
- No inline error HTML

**Reference:** `copilot-instructions.md` → Forms section

### 2. API Integration - Service Layer Only

**ALL API calls MUST be in `services/` directory:**

```tsx
// features/example/services/index.ts
export const exampleService = {
  getList: async (params) => { /* ... */ },
  create: async (data) => { /* ... */ },
}
```

**Why:**

- Centralized API logic
- Easier testing & mocking
- Single point of change
- Response transformation in one place

**Reference:** `.github/agents/api-integrator.md`

### 3. React Router - No "use client"

**NEVER add "use client" directive to any file.**

This is a React Router project, not Next.js. Client-side rendering is the default.

### 4. React Query - Query Key Factory Pattern

```tsx
const exampleQueryKeys = {
  all: ["example"] as const,
}

export function useExample() {
  return useQuery({
    queryKey: exampleQueryKeys.all,
    queryFn: exampleService.getList,
  })
}
```

**Why:**

- Centralized cache key management
- Easy cache invalidation
- Type-safe query references

### 5. Component Size - Max 300 Lines

**Keep components small and focused.**

If a component exceeds 300 lines:

- Extract sub-components
- Move logic to custom hooks
- Use composition over monoliths

**Reference:** `react-component-refactor` skill

### 6. Type Safety - No "any"

**Use specific types and interfaces throughout:**

```tsx
// ✅ Good
const data: Product[] = []

// ❌ Bad
const data: any[] = []
```

## 🚀 Feature Implementation Workflow

### Step 1: Define Spec (Always First)

Run spec-generator to create `.github/specs/[feature].yaml`:

```yaml
feature: example
routes:
  - path: /example
    page: ExampleList
api:
  endpoints:
    getExample: GET /example
    createExample: POST /example
forms:
  CreateExampleForm:
    fields: [field1, field2]
```

**Benefits:**

- Prevents scope creep (spec → implementation only)
- Clear requirements upfront
- Reduces back-and-forth
- Single source of truth

### Step 2: Use Feature Implementer Agent

Feature-Implementer orchestrates the entire process:

1. Generate folder structure
2. Create types & validation
3. Implement API services
4. Build components (forms, lists)
5. Set up routing
6. Run quality checks

**Ensures:** All standards applied consistently

### Step 3: Validate Against Spec

After implementation, verify:

- [ ] All routes in `app/routes.ts` match spec
- [ ] All API endpoints match spec (no extras)
- [ ] All form fields match spec
- [ ] No "use client" directives found
- [ ] No inline error HTML (FieldError only)
- [ ] Controller Pattern used in all forms
- [ ] Service layer for all API calls
- [ ] Query key factory implemented
- [ ] TypeScript compiles: `npx tsc --noEmit`

## 📚 Reference Documentation

| File                                 | Purpose                        |
| ------------------------------------ | ------------------------------ |
| `copilot-instructions.md`            | Architecture & code standards  |
| `agents/api-integrator.md`           | API service layer patterns     |
| `agents/form-builder.md`             | Form component requirements    |
| `agents/feature-implementer.md`      | Feature orchestration workflow |
| `agents/spec-generator.md`           | Specification structure        |
| `agents/state-orchestrator.md`       | State management patterns      |
| `specs/products.yaml`                | Example: Products feature      |
| `templates/form-template-strict.tsx` | Required form pattern          |

## ⚡ Quick Reference: Common Patterns

### Feature Service

```tsx
// features/[feature]/services/index.ts
export const [feature]Service = {
  getList: async (params) => { /* ... */ },
  create: async (data) => { /* ... */ },
}
```

### Query Hook

```tsx
// features/[feature]/hooks/use-[feature].ts
export function use[Feature]List() {
  return useQuery({
    queryKey: [feature]QueryKeys.all,
    queryFn: () => [feature]Service.getList(),
  })
}
```

### Mutation Hook

```tsx
export function use[Feature]Create() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: [feature]Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [feature]QueryKeys.all,
      })
    },
  })
}
```

### Form Component

See: `templates/form-template-strict.tsx`

## 🔍 Quality Checks

Before committing:

```bash
# TypeScript compilation
npx tsc --noEmit

# Check for "use client"
grep -r "use client" app/features/

# Check for inline error HTML
grep -r "className.*destructive" app/features/ | grep -v "FieldError"
```

## 🆘 Troubleshooting

**Q: Form not working - "No overload matches this call"**
A: Check `@hookform/resolvers` version. Must match zod version.

```json
{
  "zod": "^4.4.3",
  "@hookform/resolvers": "^3.3.4"
}
```

**Q: "use client" directive in component**
A: Remove it. This is React Router, not Next.js.

**Q: Error displayed with custom `<span>`**
A: Use `<FieldError errors={[errors.field]} />` instead.

**Q: Component exceeds 300 lines**
A: Extract logic to hooks or split into sub-components.

## 📝 Contributing

When adding new features:

1. **Create spec first** (.github/specs/[feature].yaml)
2. **Use agents** (feature-implementer, form-builder, api-integrator)
3. **Follow patterns** (Controller Pattern, FieldError, service layer)
4. **Validate standards** (no "use client", TypeScript passes, no "any" types)
5. **Update this guide** if introducing new patterns

## ❓ Questions

Refer to:

- Architecture questions → `copilot-instructions.md`
- Form issues → `agents/form-builder.md`
- API/Query questions → `agents/api-integrator.md`
- Feature scope → Look at spec in `.github/specs/`

---

**Last Updated:** May 2026
**Standards Version:** 1.0
**Enforced By:** Feature Implementer, Form Builder, API Integrator agents
