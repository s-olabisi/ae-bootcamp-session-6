# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date, so they can prioritize work and quickly spot items past their due date. Must include automated tests covering the overdue determination logic and its display, following existing Jest patterns."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spot overdue todos at a glance (Priority: P1)

As a todo application user, when I view my todo list, I want incomplete todos whose due date has passed to be clearly and visually distinguished from other todos, so I can immediately see which tasks need my attention without comparing each due date to today's date myself.

**Why this priority**: This is the core value of the feature — without a visible indicator, users gain no benefit. It is the minimum viable slice that delivers the requested capability.

**Independent Test**: Can be fully tested by creating a todo with a due date in the past and leaving it incomplete, then viewing the todo list and confirming the item is shown with a distinct overdue treatment (e.g., color/label) while other todos are not.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and not marked complete, **When** the user views the todo list, **Then** the todo is displayed with a distinct overdue indicator (e.g., color and/or label).
2. **Given** a todo with a due date today or in the future, **When** the user views the todo list, **Then** the todo is displayed without the overdue indicator.
3. **Given** a todo with no due date set, **When** the user views the todo list, **Then** the todo is never displayed with the overdue indicator.
4. **Given** a todo with a due date in the past that is marked complete, **When** the user views the todo list, **Then** the todo is displayed without the overdue indicator.

---

### User Story 2 - Overdue status is accessible, not just visual (Priority: P2)

As a todo application user relying on assistive technology, I want the overdue status of a todo to be conveyed through text (not color alone), so I can understand which tasks are overdue using a screen reader or in high-contrast/no-color viewing conditions.

**Why this priority**: Ensures the feature meets accessibility expectations already established for the app (WCAG AA, no reliance on color alone) and doesn't exclude assistive-technology users.

**Independent Test**: Can be fully tested by inspecting an overdue todo's rendered output/labeling (e.g., an "Overdue" text label or equivalent accessible attribute) independent of its visual styling.

**Acceptance Scenarios**:

1. **Given** a todo that is overdue, **When** the todo is displayed, **Then** an accessible text label (e.g., "Overdue") or equivalent descriptive attribute identifies its status in addition to any color styling.
2. **Given** a todo that is not overdue, **When** the todo is displayed, **Then** no overdue label or attribute is present.

---

### User Story 3 - Overdue status stays current after edits (Priority: P3)

As a todo application user, when I change a todo's due date or mark it complete/incomplete, I want its overdue indicator to update immediately, so the list always reflects accurate, current status without needing a page reload.

**Why this priority**: Correctness over time is important, but the app already re-renders on state changes for other fields; this validates the overdue logic behaves consistently with those existing update flows.

**Independent Test**: Can be fully tested by editing an overdue todo's due date to a future date (or marking it complete) and confirming the overdue indicator disappears immediately, then reverting the change and confirming it reappears.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user marks it complete, **Then** the overdue indicator is removed immediately.
2. **Given** an overdue todo, **When** the user edits its due date to today or a future date, **Then** the overdue indicator is removed immediately.
3. **Given** a non-overdue todo with a future due date, **When** the user edits its due date to a past date while it remains incomplete, **Then** the overdue indicator appears immediately.

---

### Edge Cases

- A todo due exactly today (not yet past) is not overdue; it only becomes overdue starting the day after its due date.
- A todo without a due date is never considered overdue, regardless of completion status.
- Reopening (marking incomplete) a previously completed todo with a past due date causes it to become overdue again.
- The overdue determination MUST be re-evaluated whenever the list is rendered, so a todo that was not overdue when the page was loaded becomes overdue once its due date passes on a later view (e.g., after a page refresh).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine a todo to be overdue when its due date is earlier than the current date and the todo is not marked complete.
- **FR-002**: System MUST NOT mark a todo as overdue if it has no due date.
- **FR-003**: System MUST NOT mark a todo as overdue if it is marked complete, regardless of due date.
- **FR-004**: System MUST visually distinguish overdue todos in the todo list using styling consistent with the existing design system (e.g., the established danger/warning color).
- **FR-005**: System MUST convey overdue status through an accessible text label or attribute, not through color alone.
- **FR-006**: System MUST update a todo's overdue indicator immediately when the user changes its due date or toggles its completion status, without requiring a page reload.
- **FR-007**: System MUST re-evaluate overdue status each time the todo list is rendered, based on the current date at render time.

### Key Entities

- **Todo**: Existing entity representing a task with a title, optional due date, and completion status. This feature adds a derived (non-persisted) "overdue" status computed from the existing due date and completion fields.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos in their list within a few seconds of viewing it, without manually comparing any due date to today's date.
- **SC-002**: 100% of incomplete todos with a due date earlier than the current date are displayed with the overdue indicator.
- **SC-003**: 0% of completed todos or todos without a due date are ever displayed with the overdue indicator.
- **SC-004**: Overdue indicators reflect the correct status immediately (no stale state) after any due date edit or completion toggle, in 100% of cases exercised by tests.

## Assumptions

- "Overdue" is defined by comparing the todo's due date (calendar date only) to the current date; a todo becomes overdue the day after its due date, not intraday by time-of-day.
- Overdue status is a derived/computed value based on existing `dueDate` and `completed` fields; no new field is persisted to the backend for this feature.
- Visual treatment reuses the existing design system's danger color and typography already defined in `docs/ui-guidelines.md`, applied to the todo card component.
- No reordering, sorting, filtering, counting, or summary/badge of overdue todos is introduced by this feature — only per-item identification, per the feature request's scope.
- No notifications or reminders are introduced by this feature.
