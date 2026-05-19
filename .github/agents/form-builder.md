# Form Builder

Generate forms using React Hook Form + Zod with the Field component architecture.

See `copilot-instructions.md` for form standards and `.github/templates/form-template-with-hook-form.tsx` for implementation examples.

## Key Principles

- **Controller Pattern**: Every form field MUST be wrapped in `<Controller>` (see template)
- **FieldError Only**: Use `<FieldError>` component for all error display (never inline `<span>`)
- **Zod Schemas**: Define all validation schemas in `features/[feature]/types/index.ts`
- **Accessibility**: Include `aria-invalid` attributes on form inputs
- **Max 300 Lines**: Keep form components under strict line limit
- **No API Messages**: Never display raw API error messages to users
