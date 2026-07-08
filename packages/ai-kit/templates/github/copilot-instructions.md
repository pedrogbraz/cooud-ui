# Copilot instructions for __APP_NAME__

These are the core rules for suggesting code in this repository. The full engineering doctrine lives in AGENTS.md at the repo root — read it for evidence levels, the reliability gate, and criticality (P0–P3).

## Core rules

- **Evidence before claims.** Verify before asserting. Never invent facts, numbers, APIs, files, or sources. Say what you did not check.
- **Root cause over symptom.** Separate fact from inference from assumption. Attack the underlying cause, not the surface.
- **Preserve shared contracts.** Before changing code, read the surrounding context, map the blast radius, and find every caller. Do not break other consumers in the same change; if you cannot fix them all in one diff, stop and report.
- **No unbounded work.** No retry without a ceiling, no infinite polling or loops, no unthrottled fan-out, no boot that crashes on a missing dependency, and no silent fallback that hides an error.
- **Meet the reliability gate.** Anything critical (P0/P1) is not done until code review and QA reach high confidence: build green, relevant tests passing, error paths exercised, correct target verified. After three failed correction cycles, stop and escalate.
- **Commit cleanly.** Use a dedicated branch and small Conventional Commits. No AI attribution in commit messages or PRs. No debug instrumentation in the final diff. PRs state objective, changes, tests, risks, and rollback.
- **Production is read-only.** Any deploy, migration, restart, or data change needs explicit approval and a named rollback first.
- **Ask when unsure.** State assumptions instead of guessing.

## UI work

Follow the UI library selected in `KICKOFF.md` / `stack.json`. If Cooud UI is selected, use `@cooud-ui/ui` components, theme through `@cooud-ui/tokens` / `useTheme`, and prefer `npx cooud-ui add <slug>` over hand-rolling a component. If another UI library or no UI library is selected, do not import Cooud UI packages unless the project explicitly adds them. Never inline raw colors and respect `prefers-reduced-motion`.
