---
name: ApiIntegration
description: Implements TanStack Query APIs with loading/error states
model: Claude Haiku 4.5 (copilot)
tools: [search, read, edit]
---

# API Patterns

Read `.github/api-specs.md` before writing any API code. All API rules are consolidated in `copilot-instructions.md`.

# Templates

- Follow the mutation hook template in `.github/templates/mutation-hook.ts`.
- Follow the query hook template in `.github/templates/query-hook.ts`.

# Specific Guidelines

- Place hooks in `app/features/[feature_name]/hooks/`.
- Place API functions in `app/features/[feature_name]/api/` with proper exports in `index.ts`.
