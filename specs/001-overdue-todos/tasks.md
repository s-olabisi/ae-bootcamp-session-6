---

description: "Task list template for feature implementation"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: The feature specification explicitly requires automated tests covering both the
overdue determination logic and its display, so test tasks are included below.

**Organization**: Tasks are grouped by user story (from spec.md) to enable independent
implementation and testing of each story. This feature is frontend-only
(`packages/frontend`); the backend is unaffected.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Existing monorepo layout: `packages/frontend/src/`, `packages/backend/src/`
- This feature only touches `packages/frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the new module location for this feature

- [ ] T001 Create `packages/frontend/src/utils/` and `packages/frontend/src/utils/__tests__/` directories for the new overdue utility module (no `utils/` folder currently exists in the frontend package)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core building blocks shared by all three user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 [P] Implement `isOverdue(todo)` pure function in `packages/frontend/src/utils/overdue.js` per the interface in [data-model.md](./data-model.md): returns `true` only when `todo.dueDate` is a calendar date earlier than today AND `todo.completed` is falsy; returns `false` when `dueDate` is `null`; calendar-date-only comparison (no time-of-day), per [research.md](./research.md) (depends on T001)
- [ ] T003 [P] Add `.overdue-badge` CSS rule to `packages/frontend/src/styles/theme.css` using `background-color: var(--danger-color)` and white text, sized as a small badge/chip consistent with existing design tokens (depends on T001)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Spot overdue todos at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos whose due date has passed are visually distinguished with an
"Overdue" badge next to the due date; other todos show no badge.

**Independent Test**: Create a todo with a past due date and leave it incomplete, view the
todo list, and confirm only that item shows an "Overdue" badge.

### Tests for User Story 1 ⚠️

> **NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T004 [P] [US1] Unit tests for `isOverdue()` in `packages/frontend/src/utils/__tests__/overdue.test.js` covering: past due date + incomplete → `true`; due date today + incomplete → `false`; future due date + incomplete → `false`; no due date → `false`; past due date + completed → `false` (depends on T002)
- [ ] T005 [US1] Component tests in `packages/frontend/src/components/__tests__/TodoCard.test.js`: a todo with a past due date and not completed renders an "Overdue" badge; a todo with a future or today due date renders no badge; a todo with no due date renders no badge; a completed todo with a past due date renders no badge (Acceptance Scenarios 1-4)

### Implementation for User Story 1

- [ ] T006 [US1] Import `isOverdue` from `../utils/overdue` into `packages/frontend/src/components/TodoCard.js` and compute `const overdue = isOverdue(todo);` in the component body (depends on T002)
- [ ] T007 [US1] Render `<span className="overdue-badge">Overdue</span>` immediately after the `todo-due-date` paragraph in `packages/frontend/src/components/TodoCard.js` when `overdue` is `true`, leaving the due-date text's own styling unchanged (depends on T003, T006, T005)

**Checkpoint**: User Story 1 is fully functional and independently testable (FR-001–FR-004)

---

## Phase 4: User Story 2 - Overdue status is accessible, not just visual (Priority: P2)

**Goal**: Overdue status is conveyed through visible badge text, not color alone.

**Independent Test**: Inspect an overdue todo's rendered output and confirm the "Overdue"
badge text is present, independent of its color styling.

### Tests for User Story 2 ⚠️

- [ ] T008 [US2] Component test in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting the "Overdue" badge is queryable by its visible text content (e.g. `getByText('Overdue')`) for an overdue todo, and is absent for a non-overdue todo (depends on T007)

### Implementation for User Story 2

- [ ] T009 [US2] Review `packages/frontend/src/components/TodoCard.js` badge markup to confirm it exposes plain visible text "Overdue" (no icon-only or color-only signal), so the status is available to assistive technology through text content alone (depends on T007)

**Checkpoint**: User Stories 1 AND 2 both work independently (FR-005)

---

## Phase 5: User Story 3 - Overdue status stays current after edits (Priority: P3)

**Goal**: The overdue badge updates immediately when a todo's due date or completion status
changes, with no page reload.

**Independent Test**: Edit an overdue todo's due date to a future date (or mark it complete)
and confirm the badge disappears immediately, then revert and confirm it reappears.

### Tests for User Story 3 ⚠️

- [ ] T010 [US3] Component test in `packages/frontend/src/components/__tests__/TodoCard.test.js`: marking an overdue todo complete removes the "Overdue" badge immediately on re-render (depends on T007)
- [ ] T011 [US3] Component test in `packages/frontend/src/components/__tests__/TodoCard.test.js`: editing an overdue todo's due date to a future date removes the "Overdue" badge immediately (depends on T007)
- [ ] T012 [US3] Component test in `packages/frontend/src/components/__tests__/TodoCard.test.js`: editing a non-overdue todo's due date to a past date, while it remains incomplete, shows the "Overdue" badge immediately (depends on T007)

### Implementation for User Story 3

- [ ] T013 [US3] Confirm `packages/frontend/src/components/TodoCard.js` recomputes `isOverdue(todo)` inline on every render (no memoization or cached component state) so prop updates from `onToggle`/`onEdit` re-render the badge without a page reload (depends on T006)

**Checkpoint**: All three user stories are independently functional (FR-006, FR-007, SC-004)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [ ] T014 [P] Run `npm run test:frontend` and `npm test` from the repo root per [quickstart.md](./quickstart.md) and confirm all new/existing tests pass with no regressions
- [ ] T015 [P] Manually validate [quickstart.md](./quickstart.md)'s Manual Validation steps 1–8 in the running app (`npm start`)
- [ ] T016 [P] Review `.overdue-badge` white-text-on-`--danger-color` contrast in both light and dark themes (`packages/frontend/src/styles/theme.css`) for WCAG AA compliance per plan.md Constraints

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion and on US1's badge existing (T007), since it validates the same badge's accessibility
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion and on US1's badge/computation existing (T006, T007), since it validates the same badge's live-update behavior
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependency on other stories
- **User Story 2 (P2)**: Builds on the badge rendered in US1 (same `TodoCard.js` markup); adds accessibility-focused tests/review only, no new rendering logic
- **User Story 3 (P3)**: Builds on the `isOverdue`/badge wiring from US1 (same `TodoCard.js` markup); adds live-update tests/review only, no new rendering logic

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Utility logic (T002) before component wiring (T006, T007)
- Story complete before moving to next priority

### Parallel Opportunities

- T002 and T003 (Foundational) can run in parallel - different files
- T004 (unit tests in `overdue.test.js`) can run in parallel with T005 (component tests in `TodoCard.test.js`) - different files
- T014, T015, T016 (Polish) can run in parallel - different concerns/files
- Tasks that edit `packages/frontend/src/components/__tests__/TodoCard.test.js` (T005, T008, T010, T011, T012) or `packages/frontend/src/components/TodoCard.js` (T006, T007, T009, T013) touch shared files and should be done sequentially, not in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch Foundational tasks together (different files):
Task: "Implement isOverdue(todo) pure function in packages/frontend/src/utils/overdue.js"
Task: "Add .overdue-badge CSS rule to packages/frontend/src/styles/theme.css"
```

## Parallel Example: User Story 1 Tests

```bash
# Launch both test files for User Story 1 together (different files):
Task: "Unit tests for isOverdue() in packages/frontend/src/utils/__tests__/overdue.test.js"
Task: "Component tests for Overdue badge in packages/frontend/src/components/__tests__/TodoCard.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run `npm run test:frontend`, confirm badge appears/disappears per Acceptance Scenarios 1–4
5. Deploy/demo if ready — this alone satisfies the feature's core value (SC-001, SC-002, SC-003)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently (accessibility) → Deploy/Demo
4. Add User Story 3 → Test independently (live updates) → Deploy/Demo
5. Each story adds test coverage/validation without changing previously delivered behavior

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This feature has a single shared implementation surface (`overdue.js` + `TodoCard.js`); US2
  and US3 primarily add tests/review confirming that surface already satisfies their
  requirements, per the Simplicity & Scope Discipline constitution principle
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No backend, API, or data-model changes are required for this feature
