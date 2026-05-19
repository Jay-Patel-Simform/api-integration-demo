---
name: sonarqube-fixer
description: "Fix SonarQube code quality issues in React/TypeScript projects. Use when: addressing code smells, reducing cognitive complexity, fixing maintainability issues, resolving bugs flagged by SonarQube, refactoring complex functions, removing duplicate logic, fixing hook dependencies, or improving type safety. Preserves behavior and UI while improving code quality."
argument-hint: "Rule key (e.g., S3776) or file path to fix"
user-invocable: true
---

# SonarQube Issues Fixer

Multi-step workflow for fixing SonarQube code quality issues in React + TypeScript projects while preserving functionality and UI.

## When to Use This Skill

- Address SonarQube code smells, bugs, or maintainability issues
- Reduce cognitive complexity in functions (S3776)
- Fix React hook dependency warnings (S4143, S4260)
- Remove duplicate logic (S1192, S4144)
- Improve type safety (S4325, S2589)
- Refactor large functions (S138, S1541)
- Fix nested conditionals (S134, S1067)
- Remove unused variables/imports (S1481, S1172)
- Address magic numbers (S109)
- Fix improper equality checks (S1125, S3923)

## What This Skill Does

1. Analyzes SonarQube reports or issues
2. Categorizes issues by severity and type
3. Plans minimal safe refactors
4. Implements fixes without behavior changes
5. Verifies functionality preserved
6. Documents changes with rule mappings

## Strict Constraints

**NEVER Do These:**

- ❌ Change UI or visual appearance
- ❌ Modify runtime behavior or business logic
- ❌ Alter API contracts or data structures
- ❌ Remove features or functionality
- ❌ Use `// NOSONAR` or rule suppressions
- ❌ Disable rules globally or locally
- ❌ Weaken TypeScript type safety
- ❌ Change styling or CSS

**ALWAYS Preserve:**

- ✅ Exact functionality
- ✅ User experience
- ✅ Component interfaces
- ✅ Type safety
- ✅ Test coverage

---

## 5-Phase Workflow

### Phase 1: Analysis

**Objective:** Understand the SonarQube issues and their context.

**Steps:**

1. **Identify Issues**
   - Parse SonarQube report (JSON, HTML, or console output)
   - List all issues with rule keys, severity, and locations
   - Group by file and component

2. **Categorize by Type**
   - **Bugs:** Logic errors, null pointer risks, type issues
   - **Code Smells:** Complexity, duplication, maintainability
   - **Security:** Potential vulnerabilities
   - **Coverage:** Missing tests (note but don't fix in this phase)

3. **Prioritize**
   - **P0 Critical:** Bugs that could cause runtime errors
   - **P1 High:** Major code smells (cognitive complexity, duplicates)
   - **P2 Medium:** Minor code smells (magic numbers, naming)
   - **P3 Low:** Style issues, minor improvements

4. **Assess Blast Radius**
   - Check if component is used in multiple places
   - Verify if changes might affect other components
   - Note any shared utilities that might need updates

**Output:** Issue inventory with priorities and context

```markdown
## SonarQube Issues Found

### P0: Critical Bugs (Fix First)

- S2589 in Dashboard.tsx:45 - Boolean expression always true
- S4325 in UserForm.tsx:78 - Optional chaining without nullish coalescing

### P1: High Priority Code Smells

- S3776 in DataTable.tsx:120 - Cognitive complexity of 28 (limit: 15)
- S1192 in utils/format.ts:23 - String literal duplicated 5 times

### P2: Medium Priority

- S109 in constants.ts:12 - Magic number 86400000
- S1172 in hooks/useAuth.ts:34 - Unused parameter 'options'
```

### Phase 2: Planning

**Objective:** Design minimal safe refactors for each issue.

**Steps:**

1. **For Each Issue, Determine Fix Strategy**

   **Cognitive Complexity (S3776, S1541):**
   - Extract helper functions
   - Use early returns instead of nested ifs
   - Simplify boolean expressions
   - Split into smaller functions

   **Duplicate Logic (S1192, S4144):**
   - Extract to named constants
   - Create shared utility functions
   - Use object maps instead of switch statements

   **Hook Dependencies (S4143, S4260):**
   - Add missing dependencies to dependency arrays
   - Wrap functions in useCallback if needed
   - Memoize values with useMemo

   **Type Safety (S4325, S2589):**
   - Add nullish coalescing operators
   - Use type guards
   - Add explicit return types
   - Remove redundant conditions

   **Magic Numbers (S109):**
   - Extract to named constants
   - Document meaning

   **Unused Code (S1481, S1172):**
   - Remove unused variables
   - Remove unused imports
   - Remove unused parameters

2. **Create Refactoring Plan**
   - List exact changes needed
   - Note files to modify
   - Identify helper functions to create
   - Document expected outcomes

3. **Verify Safety**
   - Ensure no behavior changes
   - Confirm no breaking changes to interfaces
   - Check impact on tests

**Output:** Detailed refactoring plan per issue

```markdown
## Refactoring Plan

### Issue: S3776 - Cognitive Complexity in DataTable.tsx

**Current:** 180-line function with complexity 28
**Target:** Split into 3 functions, each < 15 complexity

**Changes:**

1. Extract row rendering logic → `renderRow()` helper
2. Extract filtering logic → `getFilteredData()` helper
3. Extract sorting logic → `getSortedData()` helper
4. Main function coordinates helpers

**Files to modify:**

- src/components/DataTable.tsx

**No behavior changes:** ✓ All logic preserved, just reorganized
```

### Phase 3: Implementation

**Objective:** Apply fixes systematically, one issue at a time.

**Steps:**

1. **Fix One Issue at a Time**
   - Start with P0 bugs
   - Move to P1 high priority
   - Then P2 medium
   - Finally P3 low

2. **For Cognitive Complexity Issues:**

   ```tsx
   // ❌ BEFORE - S3776: Cognitive complexity 28
   function processData(data: Data[], filter: string) {
     const result = []
     for (const item of data) {
       if (item.active) {
         if (filter) {
           if (item.name.includes(filter)) {
             if (item.score > 50) {
               result.push({ ...item, processed: true })
             }
           }
         } else {
           if (item.score > 50) {
             result.push({ ...item, processed: true })
           }
         }
       }
     }
     return result
   }

   // ✅ AFTER - Complexity reduced to 8
   function processData(data: Data[], filter: string): ProcessedData[] {
     return data
       .filter(item => isEligibleItem(item, filter))
       .map(item => ({ ...item, processed: true }))
   }

   function isEligibleItem(item: Data, filter: string): boolean {
     if (!item.active) return false
     if (item.score <= 50) return false
     if (!filter) return true
     return item.name.includes(filter)
   }
   ```

3. **For Duplicate Logic:**

   ```tsx
   // ❌ BEFORE - S1192: String literal duplicated
   const API_URL = "https://api.example.com/v1"
   fetch("https://api.example.com/v1/users")
   fetch("https://api.example.com/v1/products")

   // ✅ AFTER - Extract constant
   const API_BASE_URL = "https://api.example.com/v1"
   fetch(`${API_BASE_URL}/users`)
   fetch(`${API_BASE_URL}/products`)
   ```

4. **For Hook Dependencies:**

   ```tsx
   // ❌ BEFORE - S4143: Missing dependency
   useEffect(() => {
     fetchData(userId)
   }, []) // userId missing

   // ✅ AFTER - Add dependency
   useEffect(() => {
     fetchData(userId)
   }, [userId])

   // If fetchData needs memoization
   const fetchData = useCallback((id: string) => {
     // implementation
   }, [])
   ```

5. **For Type Safety:**

   ```tsx
   // ❌ BEFORE - S4325: Unsafe optional chaining
   const name = user?.profile?.name || "Guest"

   // ✅ AFTER - Add nullish coalescing
   const name = user?.profile?.name ?? "Guest"

   // ❌ BEFORE - S2589: Condition always true
   if (items.length > 0 && items) { // items always truthy here

   // ✅ AFTER - Remove redundant check
   if (items.length > 0) {
   ```

6. **For Magic Numbers:**

   ```tsx
   // ❌ BEFORE - S109: Magic number
   const cacheExpiry = Date.now() + 86400000

   // ✅ AFTER - Named constant
   const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000
   const cacheExpiry = Date.now() + MILLISECONDS_IN_DAY
   ```

7. **Document Each Fix**
   - Note the rule key
   - Explain what changed
   - Confirm behavior preserved

**Output:** Fixed code with explanations

```markdown
✅ **Fixed S3776** - Cognitive Complexity in DataTable.tsx

- Extracted `renderRow()`, `getFilteredData()`, `getSortedData()` helpers
- Reduced complexity from 28 to 8
- No behavior changes: All logic preserved

✅ **Fixed S1192** - Duplicate string literals in api.ts

- Extracted API_BASE_URL constant
- Updated 8 fetch calls to use constant
- No behavior changes: Same URLs used
```

### Phase 4: Verification

**Objective:** Ensure no functionality or UI has changed.

**Steps:**

1. **Code Review Checklist**
   - [ ] No visual/UI changes
   - [ ] No behavior changes in user flows
   - [ ] All original logic preserved
   - [ ] Component interfaces unchanged
   - [ ] No breaking changes to props/types
   - [ ] TypeScript compiles without errors

2. **Run Tests**

   ```bash
   npm run test
   npm run type-check
   ```

   - All existing tests should pass
   - No new test failures

3. **Manual Testing (if applicable)**
   - Test affected user flows
   - Verify UI renders correctly
   - Check console for errors
   - Verify data flows work

4. **SonarQube Re-scan**
   - Run SonarQube analysis again
   - Verify issues are resolved
   - Check no new issues introduced

**Output:** Verification report

```markdown
## Verification Results

✅ **Tests:** All 247 tests passing
✅ **TypeScript:** No type errors
✅ **Manual Testing:** User flows working correctly
✅ **SonarQube:** All P0 and P1 issues resolved
⚠️ **Note:** 3 P2 issues remain (planned for next iteration)
```

### Phase 5: Documentation

**Objective:** Document what was fixed and why.

**Steps:**

1. **Create Fix Summary**
   - List all rules addressed
   - Note files modified
   - Summarize approach taken

2. **Document Each Fix**
   - Rule key and description
   - What was changed
   - Why it satisfies SonarQube
   - Confirmation of no behavior change

3. **Note Remaining Issues**
   - List any unfixed issues
   - Explain why (if deferred)
   - Plan for addressing them

**Output:** Complete documentation

```markdown
# SonarQube Fixes Applied

## Summary

- **Files modified:** 5
- **Issues fixed:** 12
- **Issues remaining:** 3 (P3 low priority)

## Fixes by Rule

### S3776 - Cognitive Complexity

**Files:** DataTable.tsx, Dashboard.tsx
**Fix:** Extracted helper functions, used early returns
**Impact:** Complexity reduced from 28 to 8 (DataTable), 22 to 12 (Dashboard)
**Behavior:** ✅ No changes

### S1192 - Duplicate String Literals

**Files:** api.ts, utils/fetch.ts
**Fix:** Extracted API_BASE_URL constant
**Impact:** 8 duplicates eliminated
**Behavior:** ✅ No changes

### S4143 - Missing Hook Dependencies

**Files:** useAuth.ts, useData.ts
**Fix:** Added userId and options to dependency arrays
**Impact:** Fixed React exhaustive-deps warnings
**Behavior:** ✅ No changes

## Remaining Issues

- S109 in config.ts:45 - Magic number (planned for sprint 3)
- S1172 in legacy/old.ts:12 - Unused param (legacy file, low priority)
- S138 in report.ts:200 - Function too long (requires design discussion)
```

---

## Common SonarQube Rules Reference

See [Common Rules Reference](./references/rules-reference.md) for detailed explanations of:

- S3776 - Cognitive Complexity
- S1192 - Duplicate String Literals
- S4143, S4260 - React Hook Dependencies
- S4325 - Optional Chaining
- S109 - Magic Numbers
- S1541 - Large Functions
- S134, S1067 - Nested Conditionals
- And 20+ more common rules

## Refactoring Patterns

See [Refactoring Patterns](./references/refactoring-patterns.md) for:

- Complexity reduction techniques
- Extract function patterns
- Early return patterns
- Object map strategies
- Hook optimization patterns

---

## Quality Checklist

Before completing the skill workflow:

- [ ] All P0 critical bugs fixed
- [ ] P1 high priority issues addressed
- [ ] Code compiles without errors
- [ ] All tests passing
- [ ] No behavior changes introduced
- [ ] No UI changes made
- [ ] Component interfaces unchanged
- [ ] Documentation complete
- [ ] SonarQube re-scan shows improvements
- [ ] No suppressions or NOSONAR comments used

---

## Success Criteria

**Successful Outcome:**

- ✅ SonarQube quality gate passes
- ✅ All critical and major issues resolved
- ✅ Code is more maintainable
- ✅ No functionality broken
- ✅ No visual changes
- ✅ Tests all passing
- ✅ TypeScript types enforced

**Metrics:**

- **Technical Debt Reduction:** [X] hours saved
- **Maintainability:** Increased by refactoring
- **Code Coverage:** Maintained or improved
- **Complexity:** Reduced to acceptable levels

---

## Troubleshooting

**Issue: Fix breaks tests**

- Revert changes
- Analyze test expectations
- Ensure logic preservation
- Fix incrementally

**Issue: TypeScript errors after fix**

- Check type definitions
- Verify return types
- Update type assertions if needed
- Don't weaken types

**Issue: Can't reduce complexity enough**

- Consider splitting component
- Extract business logic to hooks
- Discuss architectural changes
- Document technical debt

---

## Example Invocation

```
/sonarqube-fixer fix issues in src/components/Dashboard.tsx
/sonarqube-fixer S3776
/sonarqube-fixer all critical issues
```

---

## Related Tools

- **SonarQube Scanner:** Run analysis locally
- **SonarLint:** Real-time issues in IDE
- **ESLint:** Complementary linting
- **TypeScript:** Type checking

---

**Remember:** The goal is cleaner, more maintainable code WITHOUT changing what users see or experience. When in doubt, preserve behavior over following SonarQube rules.
