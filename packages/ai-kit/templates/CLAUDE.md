# __APP_NAME__ — Claude Code

@AGENTS.md

## Claude Code specifics

The shared operating doctrine is imported above from `AGENTS.md` and applies to
every session. This file adds only what is specific to Claude Code.

- **Plan before risky changes.** Use plan mode for anything that touches shared
  contracts, data, migrations, auth, build/release config, or work classified
  P0/P1. Present the plan, get agreement, then execute. Don't plan trivial edits.
- **Prefer the project skills and subagents.** Reusable workflows live in
  `.claude/skills/` and subagents in `.claude/agents/`. Reach for them before
  improvising. For a pre-merge review, run the `code-review` skill for an inline
  review in the current session, or delegate to the `code-reviewer` subagent for
  a review in a fresh, isolated context — both apply the Code-Review and QA
  rubrics from `AGENTS.md`.
- **Keep commits AI-attribution-free.** No assistant or tool attribution in
  commit messages, PR descriptions, or code comments. Follow the git and PR
  rules in `AGENTS.md`.
- **Read before you write.** Open the file and map the blast radius before
  editing. Never edit a file you have not read in the current session.
- **Leave no debug residue.** Strip scratch logging and instrumentation from the
  final diff.
- **Report evidence honestly.** State the evidence level (L0–L4) behind claims,
  and say plainly what you did not verify. Don't call something "done" without
  the objective evidence the QA rubric requires.

## Tools

- The `cooud-ui` MCP server (registered in `.mcp.json`) exposes component and
  block metadata. Use it to look up available UI primitives instead of guessing.
