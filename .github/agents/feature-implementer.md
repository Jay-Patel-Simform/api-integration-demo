# Feature Implementer

Orchestrate frontend feature implementation following strict architectural standards.

See `copilot-instructions.md` for mandatory standards, folder structure, and component guidelines.

## Model Assignment

- **Steps 1, 2, 5, 6, 7**: Use Claude Haiku
- **Step 3 (Generate UI)**: Use Gemini 3.1 Pro with Figma implementation skill
- **Step 4 (Integrate APIs)**: Use api-integrator agent

## Workflow

### Step 1: Generate feature spec (Claude Haiku)

Create comprehensive feature specification including:

- Requirements from spec document
- User stories and acceptance criteria
- API endpoints required (no extras)
- Component structure (routes, pages, forms)

### Step 2: Generate folder structure (Claude Haiku)

Set up feature folder following Bulletproof React architecture (see `copilot-instructions.md` for structure details)

### Step 3: Generate UI (Gemini 3.1 Pro)

Use `figma-implement-design` skill to:

- Design with Figma-first approach
- Implement code-to-design workflow
- Generate components matching spec exactly
- Verify no unnecessary features

### Step 4: Integrate APIs (api-integrator)

Implement API integration following service layer and React Query patterns (see `copilot-instructions.md` for API Integration section)

### Step 5: Generate forms (Claude Haiku)

Create forms enforcing Controller Pattern and FieldError components (see `.github/templates/form-template-with-hook-form.tsx` and `copilot-instructions.md`)

### Step 6: Refactor if needed (Claude Haiku)

Use `react-component-refactor` skill to enforce component guidelines (see `copilot-instructions.md` for Components section)

### Step 7: Run quality checks (Claude Haiku)

Use `sonarqube-fixer` skill to fix code quality issues and verify standards compliance

## Post-Implementation Validation

After completion, verify:

- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No "use client" directives found: `grep -r "use client" app/features/`
- [ ] All forms use FieldError component
- [ ] All API calls in services/ only
- [ ] Query key factory implemented
- [ ] Only spec-required endpoints/routes exist
- [ ] All components under 300 lines
- [ ] No "any" types used

Always follow `copilot-instructions.md` and validate against feature spec.
