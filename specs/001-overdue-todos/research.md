# Phase 0 Research: Support for Overdue Todo Items

All items from the spec's Clarifications session were already resolved before planning. This
research confirms the remaining implementation-level decisions needed to execute Phase 1.

## Decision: Where the overdue calculation lives

- **Decision**: Implement a pure function `isOverdue(todo)` in a new
  `packages/frontend/src/utils/overdue.js` module, imported by `TodoCard.js`.
- **Rationale**: The spec (FR-001–FR-003, FR-007) requires overdue status to be a derived,
  re-evaluated-on-every-render value with no persistence. A pure function is the simplest unit
  to test in isolation (Jest, no rendering needed) and satisfies the Constitution's Single
  Responsibility / Test-First principles. `packages/frontend/src` currently has no `utils/`
  directory, but `docs/coding-guidelines.md` explicitly recommends a "Shared Utilities" module
  for reusable logic, and `docs/testing-guidelines.md`'s example structure shows a
  `utils/formatDate.js` + colocated `__tests__/` pattern — this feature follows that same
  pattern.
- **Alternatives considered**:
  - Inlining the comparison directly inside `TodoCard.js`'s render logic — rejected because it
    would be harder to unit-test the date-comparison edge cases (today vs. past vs. future vs.
    no due date) independent of rendering, and the spec explicitly calls out testing "the
    overdue determination logic" as a distinct concern from "its display".
  - Computing overdue status in `App.js` and passing an `isOverdue` boolean prop down —
    rejected as unnecessary indirection (YAGNI); `TodoCard` already receives the full `todo`
    object and no other component needs the derived value per current scope.

## Decision: Date comparison approach

- **Decision**: Compare calendar dates only (not date-times). Parse `todo.dueDate` (a
  `YYYY-MM-DD` string, per existing backend/`todoService` usage and the `<input type="date">`
  in `TodoCard.js`) and compare it against "today" using date-only granularity, so a todo is
  overdue only starting the day after its due date.
- **Rationale**: Matches the spec's Assumptions section verbatim ("a todo becomes overdue the
  day after its due date, not intraday by time-of-day") and Edge Cases ("A todo due exactly
  today ... is not overdue").
- **Alternatives considered**: Comparing full `Date` timestamps (including time-of-day) —
  rejected because it would make a todo due "today" appear overdue as soon as any time passes
  today, contradicting the spec.

## Decision: Badge placement and styling

- **Decision**: Render a `<span className="overdue-badge">Overdue</span>` immediately next to
  the existing due-date `<p className="todo-due-date">` text, styled via a new CSS rule in
  `theme.css` that uses the existing `--danger-color` custom property as `background-color` and
  white text — no new design tokens.
- **Rationale**: FR-004/FR-005 and the Clarifications session specify exactly this ("Small
  'Overdue' text badge/chip (danger background, white text) shown next to the due date; due
  date text color unchanged"). Reusing `--danger-color` satisfies Constitution Principle III
  (Design System Fidelity) without introducing new palette values.
- **Alternatives considered**: Changing the due-date text color to red instead of adding a
  badge — explicitly rejected by the Clarifications session in favor of Option A (badge/chip).

## Decision: Test strategy

- **Decision**: Two test files — `packages/frontend/src/utils/__tests__/overdue.test.js` (pure
  unit tests for `isOverdue()` covering all Acceptance Scenarios and Edge Cases: past+incomplete,
  today+incomplete, future+incomplete, no due date, past+complete) and additions to the existing
  `packages/frontend/src/components/__tests__/TodoCard.test.js` (React Testing Library tests
  asserting the "Overdue" text is present/absent in the rendered card, and that toggling
  completion or editing due date updates the rendered badge).
- **Rationale**: Matches `docs/testing-guidelines.md`'s colocated `__tests__/` convention and
  the spec's explicit requirement to cover "the overdue determination logic and its display"
  with tests "following existing Jest patterns".
- **Alternatives considered**: Testing overdue logic only through `TodoCard` render tests
  (no separate utility) — rejected because it conflates two concerns and makes edge cases
  (e.g., date-boundary conditions) more verbose to express than direct unit tests on a pure
  function.

## Outcome

No unresolved `NEEDS CLARIFICATION` markers remain. All decisions are consistent with the
Constitution and the finalized spec.
