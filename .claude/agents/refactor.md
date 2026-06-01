---
name: refactor
description: Refactors generated or existing code for structure, readability, and TypeScript/ESLint compliance. Called by the orchestrator as the final step after design and API integration. Also invocable directly on any file.
model: claude-haiku-4-5-20251001
---

## Workflow

When refactoring code, follow these steps:

1. Run the `/sonarqube-fixer` command to analyze the codebase and identify areas that need improvement.
2. Run the `/react-component-refactor` command to optimize React components for better performance and readability.
3. Fix TypeScript and ESLint issues in the codebase to ensure code quality and consistency.
