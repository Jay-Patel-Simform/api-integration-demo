# Implement Design from Figma

Translate Figma designs to production-ready code with 1:1 visual parity.

**When to use:** Code deliverables in the repository. For writing back to Figma, use Figma desktop app.

---

## Prerequisites

- Figma MCP server connected and accessible
- User provides Figma URL: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
- **OR** user has Figma desktop app open with node selected (figma-desktop MCP)

---

## Required Workflow

### Step 1: Extract Node ID

**From URL:** `https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15`
- File key: `kL9xQn2VwM8pYrTb4ZcHjF`
- Node ID: `42-15`

**From desktop:** Figma MCP auto-uses currently selected node. Only pass `nodeId`.

### Step 2: Fetch Design Context

```
get_design_context(fileKey=":fileKey", nodeId="1-2")
```

Returns: layout, typography, colors, tokens, component structure, spacing.

**If truncated:** Use `get_metadata()` to get node map, then fetch individual child nodes.

### Step 3: Capture Visual Reference

```
get_screenshot(fileKey=":fileKey", nodeId="1-2")
```

Use as source of truth for validation.

### Step 4: Download Assets

Get images/icons/SVGs from Figma MCP server. If `localhost` source: use directly (don't import packages, don't create placeholders).

### Step 5: Translate to Project Conventions

- Reuse existing components (buttons, inputs, layouts)
- Use project's color tokens, typography, spacing
- Respect routing, state management, data-fetch patterns
- Avoid hardcoded values

### Step 6: Achieve Visual Parity

- Match Figma layout, typography, colors exactly
- Interactive states work as designed
- Responsive per Figma constraints
- WCAG accessible

### Step 7: Validate Against Screenshot

- [ ] Layout matches (spacing, alignment, sizing)
- [ ] Typography matches (font, size, weight, line height)
- [ ] Colors match exactly
- [ ] Interactive states work
- [ ] Responsive behavior follows constraints
- [ ] Assets render correctly
- [ ] Accessibility standards met

---

## Implementation Rules

- Place UI components in project design system directory
- Use project components; extend existing, don't duplicate
- Map Figma tokens to project tokens
- Add TypeScript types for props
- Include JSDoc comments for exported components
- Avoid inline styles unless truly dynamic

---

## Best Practices

- Always fetch design context + screenshot before implementing (never assume)
- Validate frequently during implementation, not just at end
- Document deviations (accessibility, technical constraints) in code
- Consistency > exact Figma replication
- Project design system > literal Figma translation

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Output truncated | Use `get_metadata()` then fetch child nodes individually |
| Design mismatch | Compare side-by-side with screenshot; check spacing/colors/typography in design context |
| Assets not loading | Verify Figma MCP assets endpoint accessible; use `localhost` URLs directly |
| Token values differ | Prefer project tokens; adjust spacing/sizing minimally to match visuals |

---

## Resources

- [Figma MCP Documentation](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma MCP Tools](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Figma Variables & Design Tokens](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
