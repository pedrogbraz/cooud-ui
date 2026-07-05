---
trigger: always_on
---

Always-on engineering doctrine for __APP_NAME__ (digest).

- Evidence before claims. Verify before you assert; never invent facts, numbers, or sources, and say what you did not check.
- Preserve shared contracts. Read the surrounding context, map the blast radius, and find every caller before changing code; don't break other consumers in the same diff.
- No unbounded work. No retry without a ceiling, no infinite polling or effect loop, no unthrottled fan-out, no boot that crashes on a missing dependency, no silent fallback that hides an error.
- Commit cleanly. Dedicated branch, small Conventional Commits, no AI attribution, no debug leftovers.
- Ask when unsure. State assumptions instead of guessing.
- Read before you write. Open the file and understand it before editing it.

See AGENTS.md at the repo root for the full doctrine.
