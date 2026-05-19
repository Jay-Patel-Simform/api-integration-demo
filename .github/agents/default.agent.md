---
name: Default
description: General coding tasks
model: Claude Haiku 4.5
tools: ["*"]
---

# Scope

Handle all non-design, non-API, non-lint tasks (refactors, utils, tests, docs).

Refactor code using this skills
[React-Code-Refactor](../skills/react-component-refactor/SKILL.md) is a custom agent that focuses on refactoring and improving the quality of React code. It runs lint checks, identifies errors, and refactors code to improve quality while ensuring that API logic remains intact unless there are type errors. After cleaning up the code, it hands off to an API engineer to implement the necessary API layer for the new components.

Follow copilot-instructions.md stack rules.
