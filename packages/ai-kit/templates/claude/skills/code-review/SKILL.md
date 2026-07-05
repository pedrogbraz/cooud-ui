---
name: code-review
description: Adversarially review the working diff inline, in the current session, before it ships. Use when the user asks to review changes, before committing or opening a PR, or after finishing a feature — apply the full Code-Review and QA rubric from AGENTS.md and report findings by severity, each with an evidence level. For a review in a fresh, isolated context, delegate to the code-reviewer subagent instead.
argument-hint: "[path]"
allowed-tools: Bash, Read, Grep, Glob
---

# Review the working diff (inline)

Review the not-yet-committed change **in this session**, right now. Your job is to
**find the problem**, not to confirm the work is fine — assume a bug exists until the diff
proves otherwise. For a review in a fresh, isolated context (no session bias, separate
window), delegate to the **`code-reviewer` subagent** instead.

The full Code-Review rubric, QA rubric, evidence levels, and criticality scale live in
**`AGENTS.md`** at the project root — apply them. This skill carries the essential core so
it still works if `AGENTS.md` is absent.

Optional scope (paths or a ref range): `$ARGUMENTS`

## 1. Load the change

```sh
git status
git diff              # unstaged
git diff --cached     # staged
```

Read enough surrounding code to understand the contract being changed — not just the
touched lines. Map the **blast radius**: callers, types, generated clients, env/flags,
tokens/CSS, data layer, API surface, shared utilities, and background work. A change that
can't fix all of its consumers in one diff is itself a finding.

## 2. Essential checklist — every item must hold

- Solves the actual request, root cause not symptom, with no regression.
- No obvious logic bug or unhandled edge/error case.
- No leaked secret, security hole, or unsafe/untrusted input path.
- Follows existing project patterns and conventions.
- Preserves shared contracts and behavior other consumers depend on.
- No debug instrumentation or dead scaffolding left in the diff.
- **No red-flag pattern**: unbounded retry, infinite polling / `useEffect` loop,
  unthrottled fan-out, 4xx that re-enqueues without a ceiling, boot that dies on a missing
  dependency, or a silent fallback that turns a real error into a false "0"/"OK".
- **QA evidence exists**: build/typecheck green, relevant tests pass, the error path (not
  only the happy path) was exercised, and the change lands on the correct target.
- Reviewed critically, not confirmatorily.

## 3. Output

Group findings by severity, worst first. For each:

- **[P0–P3]** one-line summary
- Location: `path:line`
- Why it matters (impact / regression risk)
- **Evidence:** L0–L4 (L0 hypothesis … L4 end-to-end verified — see `AGENTS.md`)
- Suggested fix

Severity: **P0** money/security/data-loss/production/customer-facing; **P1** important
flow, shared data/contract, integration, auth, core UX; **P2** normal iteration, contained
impact; **P3** trivial.

End with a **95% verdict**: `ship` or `fix-and-recheck`. Nothing P0/P1 ships below 95%
confidence — if you can't reach it in a few cycles, stop and escalate with what was tried,
what stays uncertain, and the recommended alternative.
