---
name: evidence-check
description: Label the claims in an answer with evidence levels before relying on them. Use before making confident technical or financial assertions, when reconciling data or numbers, or when the user asks how sure you are — tag each statement L0–L4 and list an explicit NOT-VERIFIED set.
---

# Label claims with evidence levels

Grade the confidence behind an answer before it is trusted or acted on. The evidence
scale and gates are defined in `AGENTS.md`; apply them here.

The answer or claim to grade: `$ARGUMENTS`

## Evidence levels

- **L0** — opinion, hypothesis, or a reading of context.
- **L1** — a screenshot, a report, or a partial signal.
- **L2** — a read of code, config, or local/internal data.
- **L3** — cross-referenced across two or more independent systems.
- **L4** — end-to-end verified against a primary source with a **closed reconciliation**.

## Process

1. Break the answer into discrete, checkable claims.
2. Separate **fact** from **inference** from **assumption**.
3. Tag each claim with the highest level you can actually justify — not the level you hope
   for. If the basis is a single screenshot, it is L1, not L3.
4. Identify what evidence would raise each claim one level.

## Output

- A table: **claim → level → basis** (the concrete artifact that supports it).
- A **NOT VERIFIED** list: every claim that is assumed, inferred, or unchecked, stated
  plainly.
- The next check that would move the weakest load-bearing claim up a level.

## Gates

- **Block any confident technical or financial claim below L3.** Claims that affect money,
  production, or irreversible actions should reach **L4**.
- Never invent numbers, sources, rankings, or receipts. If you lack access, say exactly
  what was **not** verified rather than filling the gap.
- Do not label something a "visual bug", "harmless", or "already fine" before it has been
  reconciled against the source.
