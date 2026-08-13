<!--
Sync Impact Report
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: N/A (first ratified version, template placeholders replaced)
Added sections:
  - Core Principles: I. Code Quality & Consistency, II. Test-First Quality Assurance,
    III. Design System Fidelity, IV. Simplicity & Scope Discipline, V. Data Integrity
    & Immediate Persistence
  - Technology & Architecture Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending manual review for Constitution Check alignment
  - .specify/templates/spec-template.md ⚠ pending manual review (out-of-scope guardrails match Principle IV)
  - .specify/templates/tasks-template.md ⚠ pending manual review (task categorization vs. testing gates)
Follow-up TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Consistency (NON-NEGOTIABLE)
All code MUST follow the conventions in `docs/coding-guidelines.md`: 2-space indentation,
LF line endings, no trailing whitespace, `camelCase` for variables/functions, `PascalCase`
for React components and classes, `UPPER_SNAKE_CASE` for constants. Imports MUST be ordered
external libraries → internal modules → styles, with no circular dependencies. Code MUST
apply DRY, KISS, and SOLID principles; each function/component/module has a single
responsibility. Comments explain *why*, not *what*. No linting errors or `console.log`
statements may remain before a pull request is opened.
**Rationale**: A shared, enforced style keeps the monorepo readable and reviewable across
frontend and backend packages maintained by multiple contributors.

### II. Test-First Quality Assurance (NON-NEGOTIABLE)
Every new component, route handler, service, or utility MUST ship with unit and, where
applicable, integration tests colocated in a `__tests__/` directory, per
`docs/testing-guidelines.md`. Tests MUST verify behavior, not implementation, use the
Arrange-Act-Assert pattern, remain isolated (no shared state, external dependencies mocked),
and use descriptive names. The project targets 80%+ coverage overall with 100% coverage on
critical user workflows (create, view, update, complete, delete a todo). All tests MUST pass
before a pull request is merged.
**Rationale**: Automated tests are the primary safety net for a JavaScript codebase without
static typing; they encode expected behavior and prevent regressions.

### III. Design System Fidelity
User-facing changes MUST conform to `docs/ui-guidelines.md`: the defined light/dark color
palettes, typography scale, and 8px spacing grid; the single-column layout with a 600px max
width; and the specified component patterns (todo card, input fields, buttons, confirmation
dialog). Both light and dark modes MUST be supported and preference persisted. Interactive
elements MUST be keyboard accessible, meet WCAG AA contrast, and expose descriptive
aria-labels. Deviations from the design system require updating `docs/ui-guidelines.md`
first.
**Rationale**: A documented design system keeps the UI visually consistent and accessible
without requiring ad hoc design decisions per feature.

### IV. Simplicity & Scope Discipline (YAGNI)
The application MUST remain a single-user todo list scoped per `docs/functional-requirements.md`.
Features explicitly marked out of scope (authentication, multi-user support, priorities/tags,
recurring todos, reminders, undo/redo, bulk operations, advanced filtering/search, mobile-specific
optimization) MUST NOT be implemented unless `docs/functional-requirements.md` is amended first.
Implementations MUST favor the simplest solution that satisfies the current requirements over
speculative generalization.
**Rationale**: Keeping scope tight avoids unnecessary complexity in a starter/bootcamp project
and keeps the codebase approachable for learning purposes.

### V. Data Integrity & Immediate Persistence
Every todo mutation (create, edit, toggle completion, delete) MUST be persisted to the backend
immediately upon user action, and state shown in the UI MUST reflect persisted data after a
page refresh. Deleting a todo MUST require explicit user confirmation via a confirmation
dialog before the deletion is persisted.
**Rationale**: `docs/functional-requirements.md` requires durable, immediately-persisted
changes and protection against accidental data loss.

## Technology & Architecture Constraints

The project is an npm-workspaces monorepo with `packages/frontend` (React + Jest) and
`packages/backend` (Express.js + Jest), per `docs/project-overview.md`. New code MUST fit the
established file organization from `docs/coding-guidelines.md` (`components/`, `services/`,
colocated `__tests__/` directories). No new runtime dependencies, frameworks, or a database
schema change may be introduced solely to support out-of-scope features (see Principle IV).

## Development Workflow & Quality Gates

Work MUST proceed on feature branches with atomic, descriptively-messaged commits, merged via
pull request review, per `docs/coding-guidelines.md`. Before requesting review, contributors
MUST run linting and the full test suite (`npm test`) and confirm the code review checklist in
`docs/coding-guidelines.md` passes. Pull requests that violate Principles I–V MUST be revised
before merge, or the deviation MUST be explicitly justified in the pull request description.

## Governance

This constitution supersedes ad hoc conventions and takes precedence over any conflicting
guidance when reviewing or authoring code. Amendments are made by editing this file and MUST
include the Sync Impact Report describing the change. Versioning follows semantic versioning:
MAJOR for backward-incompatible governance or principle removals/redefinitions, MINOR for new
principles or materially expanded guidance, PATCH for clarifications and wording fixes. All
pull requests and code reviews MUST verify compliance with the Core Principles above; any
complexity or deviation MUST be justified in the pull request description. Use the `docs/`
directory (coding, testing, UI, functional-requirements guidelines) for detailed, runtime
development guidance that implements these principles.

**Version**: 1.0.0 | **Ratified**: 2026-08-13 | **Last Amended**: 2026-08-13
