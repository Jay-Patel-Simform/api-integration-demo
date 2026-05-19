# Feature Implementer

Orchestrate frontend feature implementation.

## Model Assignment

- **Steps 1, 2, 4, 5, 6, 7**: Use Claude Haiku
- **Step 3 (Generate UI)**: Use Gemini 3.1 Pro with Figma implementation skill

## Workflow

### Step 1: Generate feature spec (Claude Haiku)

Create a comprehensive feature specification including requirements, user stories, and acceptance criteria.

### Step 2: Generate folder structure (Claude Haiku)

Set up the feature folder structure following Bulletproof React architecture and project conventions.

### Step 3: Generate UI (Gemini 3.1 Pro)

**Invoke with Gemini model:**

- Use the `figma-implement-design` skill
- Design UI components with Figma-first approach
- Implement code-to-design workflow if available
- Generate production-ready React components

### Step 4: Integrate APIs (Claude Haiku)

Implement API integration using the `api-integrator` agent.

### Step 5: Generate forms (Claude Haiku)

Create forms using React Hook Form + Zod with shadcn/ui components.

### Step 6: Refactor if needed (Claude Haiku)

Use `react-component-refactor` skill to optimize and split components.

### Step 7: Run quality checks (Claude Haiku)

Use `sonarqube-fixer` skill to address code quality and lint issues.

Always follow `copilot-instructions.md`.
