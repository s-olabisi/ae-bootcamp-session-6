# Quickstart: Validate Overdue Todo Items

This guide exercises the feature end-to-end using the existing test suite and a manual check in
the running app. No new setup, environment variables, or dependencies are required beyond the
existing monorepo install.

## Prerequisites

- Node.js and npm installed (already required by this repo)
- Dependencies installed once at the repo root: `npm run install:all`

## Automated Validation (primary)

Run the frontend test suite, which includes the new/updated tests for this feature:

```bash
npm run test:frontend
```

Expected outcome: all tests pass, including:

- `packages/frontend/src/utils/__tests__/overdue.test.js` — unit tests for `isOverdue()` covering:
  - past due date + incomplete → `true`
  - due date today + incomplete → `false`
  - future due date + incomplete → `false`
  - no due date (any completion state) → `false`
  - past due date + completed → `false`
- `packages/frontend/src/components/__tests__/TodoCard.test.js` — rendering tests covering:
  - overdue todo renders an "Overdue" badge next to the due date
  - non-overdue todo (future date, no date, or completed) renders no "Overdue" badge
  - toggling completion on an overdue todo removes the badge immediately (re-render)
  - editing an overdue todo's due date to a future date removes the badge immediately

Run the full monorepo suite to confirm no regressions in the backend or other frontend
components:

```bash
npm test
```

## Manual Validation (secondary, exploratory)

1. Start the app: `npm start` (runs both frontend and backend concurrently).
2. Add a todo with a due date set to yesterday (or any past date) and leave it incomplete.
   - **Expected**: the todo card shows an "Overdue" badge (red/danger background, white text)
     next to its due date.
3. Add a second todo with a due date set to tomorrow.
   - **Expected**: no "Overdue" badge is shown.
4. Add a third todo with no due date.
   - **Expected**: no "Overdue" badge is shown, ever.
5. Mark the first (overdue) todo complete.
   - **Expected**: the "Overdue" badge disappears immediately, no page reload needed.
6. Uncheck it again (mark incomplete).
   - **Expected**: the "Overdue" badge reappears immediately.
7. Edit the first todo's due date to a future date.
   - **Expected**: the "Overdue" badge disappears immediately.
8. Refresh the page.
   - **Expected**: overdue status for all todos is still correct after reload (recomputed from
     persisted `dueDate`/`completed`, per FR-007).

## Success Criteria Mapping

- SC-001 / SC-002: Step 2 above (and the corresponding automated test) confirm overdue todos are
  visually flagged.
- SC-003: Steps 3–4 (and automated tests) confirm no false positives for future/no-due-date/
  completed todos.
- SC-004: Steps 5–7 (and automated tests) confirm immediate updates with no stale state.
