---
name: code-review
description: Adversarially review the working diff before it ships. Use when the user asks to review changes, before committing or opening a PR, or after finishing a feature — apply the Code-Review and QA rubric from AGENTS.md and report findings by severity, each with an evidence level.
allowed-tools: Bash, Read, Grep, Glob
---

# Review the working diff

Review the change that is not yet committed. Your job is to **find the problem**, not to
confirm the work is fine. Assume a bug exists until the diff proves otherwise. The full
rubric, evidence levels, and criticality scale live in **`AGENTS.md`** at the project root;
apply them here.

Optional scope (paths or a ref range): `$ARGUMENTS`

## 1. Load the change

```sh
git status
git diff              # unstaged
git diff --cached     # staged
```

Read enough surrounding code to understand the contract being changed — not just the
touched lines. Map the **blast radius**: find callers, and check impact on types, generated
clients, env/flags, tokens/CSS, data layer, API surface, shared utilities, and background
work. If a change can't fix all of its consumers in one diff, that is itself a finding.

## 2. Code-Review rubric — pass only if all hold

- Solves the actual request with no regression.
- No obvious logic bug or unhandled edge case.
- No leaked secret, security hole, or unsafe/untrusted input path.
- Follows existing project patterns and conventions.
- Preserves shared contracts and old behavior other consumers depend on.
- No debug instrumentation or dead scaffolding left in the diff.
- Reviewed critically, not confirmatorily.

## 3. QA rubric — pass only with objective evidence

- Build / typecheck is green.
- Relevant tests pass; the error path is exercised, not only the happy path.
- The real flow was run when applicable.
- Regression was checked, and the change lands on the correct target.

## 4. Red flags — call out on sight

Unbounded retry, infinite polling, `useEffect` loops, unthrottled fan-out, 4xx responses
that re-enqueue without a ceiling, boot that dies on a missing dependency, and any silent
fallback that turns a real error into a false "0"/"OK".

## 5. Output

Group findings by severity, worst first. For each:

- **[P0–P3]** one-line summary
- Location: `path:line`
- Why it matters (impact / regression risk)
- **Evidence:** L0–L4 (see AGENTS.md — L0 hypothesis … L4 end-to-end verified)
- Suggested fix

Severity (from AGENTS.md): **P0** money/security/data-loss/production/customer-facing;
**P1** important flow, shared data/contract, integration, auth, core UX; **P2** normal
iteration, contained impact; **P3** trivial.

End with a **95% verdict**: `ship` or `fix-and-recheck`. Nothing P0/P1 ships below 95%
confidence — if you can't reach it in a few cycles, stop and escalate with what was tried,
what stays uncertain, and the recommended alternative.
