---
name: evidence-check
description: Tag each claim in an answer with an evidence level (L0–L4) and list what is NOT verified, before the answer is trusted or acted on. Use before making confident technical or financial assertions, when reconciling data or numbers, or when the user asks how sure you are.
allowed-tools: Bash, Read, Grep, Glob
---

# Tag claims with evidence levels

The L0–L4 scale and the confidence gates are defined in **`AGENTS.md`** — this skill
applies them, it does not re-teach them. Quick anchor: **L0** context/opinion, **L1**
single signal, **L2** read of code/config/data, **L3** cross-referenced across independent
sources, **L4** end-to-end verified with a closed reconciliation.

The answer or claim to grade: `$ARGUMENTS`

## Do this

1. Split the answer into discrete, checkable claims; separate **fact** from **inference**
   from **assumption**.
2. Tag each claim with the highest level you can actually justify — not the one you hope
   for. A single screenshot is L1, not L3. Use the read-only tools to raise a level where
   cheap (read the code, grep the source, run a query) rather than guessing.
3. Name, for each load-bearing claim, the one check that would move it up a level.

## Output

- **Table** — `claim → level → basis` (the concrete artifact behind the tag).
- **NOT VERIFIED** — an explicit list of every claim that is assumed, inferred, or
  unchecked, stated plainly. Do not omit or soften this set.
- **Next check** — the single verification that would raise the weakest load-bearing claim.

## Gates

- Block any confident technical or financial claim below **L3**; money, production, or
  irreversible actions need **L4**.
- Never invent numbers, sources, rankings, or receipts. If you lack access, say exactly
  what was not verified instead of filling the gap.
- Do not label something "visual only", "harmless", or "already fine" before it has been
  reconciled against the source.
