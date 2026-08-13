# UX/Visual Requirements Checklist: Support for Overdue Todo Items

**Purpose**: Validate the completeness, clarity, and consistency of the *visual/UX* requirements for the overdue badge before implementation begins (author self-review)
**Created**: 2026-08-13
**Feature**: [spec.md](../spec.md)

**Note**: This checklist tests the requirements themselves (spec.md, plan.md), not the eventual implementation. Each item asks whether a requirement is written clearly, completely, and consistently enough to implement without guessing.

## Requirement Completeness

- [ ] CHK001 - Are requirements defined for the badge's size/dimensions relative to the existing due-date text? [Gap]
- [ ] CHK002 - Are requirements defined for the badge's exact position relative to the due date (before/after, same line vs. new line)? [Completeness, Spec §FR-004]
- [ ] CHK003 - Are requirements defined for how the badge appears in dark mode, beyond "reuse the danger color token"? [Gap]
- [ ] CHK004 - Are requirements defined for how the badge interacts with the existing completed-todo styling (strike-through, reduced opacity)? [Gap, Spec §Edge Cases]
- [ ] CHK005 - Are spacing requirements between the badge and due-date text specified relative to the 8px spacing grid? [Gap]

## Requirement Clarity

- [ ] CHK006 - Is "small" (as in "small Overdue text badge/chip") quantified with a specific typography scale value (e.g., Caption, 12px)? [Clarity, Spec §FR-004]
- [ ] CHK007 - Is "next to the due date" precise enough to avoid ambiguity about left/right placement or line wrapping? [Ambiguity, Spec §FR-004]
- [ ] CHK008 - Is the badge's border-radius/shape requirement specified, or left to implementer discretion? [Clarity, Gap]

## Requirement Consistency

- [ ] CHK009 - Is the requirement that "due date text styling MUST remain unchanged" consistent with the existing Caption/text-secondary styling already documented in `docs/ui-guidelines.md`? [Consistency, Spec §FR-004]
- [ ] CHK010 - Are the badge's typography and shape requirements consistent with other existing UI patterns (buttons, chips) described in `docs/ui-guidelines.md`? [Consistency, Gap]

## Acceptance Criteria Quality

- [ ] CHK011 - Can SC-001 ("users can visually identify all overdue todos") be objectively verified from the visual requirements alone, without relying on underlying date logic? [Measurability, Spec §SC-001]
- [ ] CHK012 - Are the visual acceptance criteria for the badge (presence, color, text) separable and independently testable from the overdue-determination logic? [Acceptance Criteria Quality]

## Scenario Coverage

- [ ] CHK013 - Are visual requirements defined for the badge's appearance in both light and dark themes explicitly, rather than only implied by "reuse danger color"? [Coverage, Spec §FR-004]
- [ ] CHK014 - Are requirements defined (or explicitly excluded) for whether the badge appears while a todo card is in edit mode? [Coverage, Gap]

## Edge Case Coverage

- [ ] CHK015 - Are requirements defined for visual behavior when the todo card is narrow (e.g., mobile viewport) and both the due date and badge must fit on the card? [Edge Case, Gap]
- [ ] CHK016 - Are requirements defined for the badge's appearance/absence when a todo has no due date but is otherwise eligible for other visual states (e.g., completed)? [Edge Case, Spec §FR-002]

## Non-Functional Requirements

- [ ] CHK017 - Are WCAG AA color-contrast requirements explicitly validated for white badge text against the danger-color background in both light and dark mode tokens? [Non-Functional, Spec §FR-005]
- [ ] CHK018 - Are interaction-state requirements (hover/focus) defined for the badge, or is it explicitly specified as non-interactive? [Gap]

## Dependencies & Assumptions

- [ ] CHK019 - Is the assumption that the existing `--danger-color` token provides sufficient contrast with white text documented/validated anywhere? [Assumption, Spec §Assumptions]
- [ ] CHK020 - Is the dependency on `docs/ui-guidelines.md`'s typography scale for the badge text explicitly stated rather than only implied? [Dependency, Gap]

## Ambiguities & Conflicts

- [ ] CHK021 - Does the spec's "badge/chip" terminology map cleanly onto an existing named component in `docs/ui-guidelines.md`, or does it introduce an undocumented new component type? [Conflict, Gap]
- [ ] CHK022 - Is there a potential conflict between "due date text color unchanged" and the need for sufficient visual separation between the badge and the due date text? [Conflict, Spec §FR-004]

## Notes

- Focus: UX/Visual requirements only (accessibility-adjacent items included only where they affect visual presentation, e.g., contrast).
- Depth: Standard (author self-review before `/speckit-tasks` or `/speckit-implement`).
- Audience/timing: Author, pre-implementation.
- Check items off as completed: `[x]`
- Items are numbered sequentially (CHK001–CHK022) for easy reference.
