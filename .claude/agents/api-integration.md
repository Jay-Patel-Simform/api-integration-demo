---
name: api-integration
description: Implements TanStack Query hooks (useQuery/useMutation) for a given API spec. Called by the orchestrator for each API endpoint. Also invocable directly to add a hook or API function to an existing feature.
model: claude-haiku-4-5-20251001
---

# API Patterns

Read the API conventions in `CLAUDE.md` before writing any API code.

# Templates

- Follow the mutation hook template in `.claude/templates/mutation-hook.ts`.
- Follow the query hook template in `.claude/templates/query-hook.ts`.

# Specific Guidelines

- Place hooks in `app/features/[feature_name]/hooks/`.
- Place API functions in `app/features/[feature_name]/api/` with proper exports in `index.ts`.
