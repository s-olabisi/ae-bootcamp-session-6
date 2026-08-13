# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Add a derived, non-persisted "overdue" status to todos: a todo is overdue when its due date is
earlier than the current date and it is not marked complete. The frontend `TodoCard` component
will compute this status at render time and display a small "Overdue" text badge (danger
background, white text) next to the due date, without changing the due date's own styling.
No backend or data-model changes are required; the logic is a pure utility function covered by
Jest unit tests, and the badge rendering is covered by React Testing Library tests, following
existing test patterns in `packages/frontend/src/components/__tests__/`.

## Technical Context

**Language/Version**: JavaScript (Node.js runtime), React 18 (frontend), Express.js (backend, unaffected)

**Primary Dependencies**: React, `@testing-library/react`, Jest (already present in `packages/frontend`)

**Storage**: N/A — overdue status is derived at render time from existing `dueDate`/`completed` fields; nothing new is persisted

**Testing**: Jest + `@testing-library/react`, colocated in `__tests__/` directories per `docs/testing-guidelines.md`

**Target Platform**: Web browser (existing React SPA served by `packages/frontend`)

**Project Type**: Web application (existing `packages/frontend` + `packages/backend` monorepo) — this feature only touches `packages/frontend`

**Performance Goals**: N/A — simple date comparison per todo on each render; no measurable performance target beyond existing render performance

**Constraints**: Must not introduce new dependencies or backend/API changes; must reuse existing `--danger-color` design token from `docs/ui-guidelines.md` / `theme.css`; must meet WCAG AA text-based status conveyance (no color-only signal)

**Scale/Scope**: Single component change (`TodoCard.js`) plus a small pure utility function and associated unit/component tests; no changes to `todoService.js`, backend, or data model

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Code Quality & Consistency**: PASS — change is confined to `packages/frontend/src/components/TodoCard.js` (and a new small utility module), follows existing camelCase/PascalCase conventions and import ordering.
- **II. Test-First Quality Assurance**: PASS — new overdue-determination logic and its rendering will have colocated Jest/RTL tests in `__tests__/`, covering all acceptance scenarios (overdue, not-overdue-future, no-due-date, completed-with-past-date, live updates on toggle/edit).
- **III. Design System Fidelity**: PASS — badge reuses the existing `--danger-color` token and existing typography scale (Caption-sized text), placed next to the due date inside the current `TodoCard` layout; no new colors or layout patterns introduced.
- **IV. Simplicity & Scope Discipline**: PASS — no sorting/filtering/counting/notifications added, matching the spec's explicit Assumptions; overdue status is derived, not persisted.
- **V. Data Integrity & Immediate Persistence**: PASS — feature does not change persistence behavior; overdue indicator recomputes from existing persisted fields on every render, so it never depends on stale state after refresh/edit/toggle.

No violations. Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js                  # Modified: render "Overdue" badge next to due date
│   │   └── __tests__/
│   │       └── TodoCard.test.js         # Modified: add overdue badge scenarios
│   ├── utils/
│   │   ├── overdue.js                   # New: pure isOverdue(todo) helper
│   │   └── __tests__/
│   │       └── overdue.test.js          # New: unit tests for isOverdue()
│   └── styles/
│       └── theme.css                    # Reused: existing --danger-color token (no new tokens)

packages/backend/                        # Unaffected by this feature
```

**Structure Decision**: This is the existing "Web application" monorepo layout
(`packages/frontend` + `packages/backend`). This feature is frontend-only: it adds a small
pure utility (`packages/frontend/src/utils/overdue.js`) consumed by `TodoCard.js`, plus
colocated tests in each directory's `__tests__/` folder, per `docs/testing-guidelines.md`.
No backend, API, or data-model changes are required.

## Complexity Tracking

*No violations — this section is not applicable.*
