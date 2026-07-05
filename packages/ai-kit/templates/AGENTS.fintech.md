## Fintech / payments preset

Enable this preset when __APP_NAME__ moves money: payments, checkout, marketplaces,
payouts, wallets, subscriptions, ledgers, or anything that reports balances to a user
who makes decisions with that number. It appends to and specializes the base rules.

Central rule: **money, trust, and operational continuity outrank apparent speed.**
The financial layer holds the highest bar in the product: it cannot be approximate,
obscure, or unverified. Any number a user acts on — to scale ad spend, to pause, to
withdraw, to reconcile — must be traceable to a real source of record.

### 1. Financial truth before UI

Every financial figure must have a clear origin. If a screen shows revenue, balance,
reserve, payout, fee, refund, chargeback, or adjustment, there must be an auditable
path from that pixel to the real source: the internal ledger, the processor/acquirer,
the bank, or a recorded financial event. A pretty number without backing is a
liability, not a feature. If you cannot name the source, do not display the number as
fact.

### 2. Revenue is not withdrawable balance — separate the money layers

Never treat gross sales, net revenue, available balance, reserve, in-transit, and paid
payouts as the same thing. When you compute, explain, or render money, keep these
layers distinct and labeled:

- **approved** — the sale/authorization succeeded, but the money is not settled;
- **settled / captured** — funds confirmed by the processor;
- **in-processing** — pending settlement, clearing, or review;
- **net revenue** — settled minus fees, refunds, chargebacks, and disputes;
- **reserve** — held by rolling-reserve or risk rules, not spendable;
- **available** — cleared and eligible to be paid out;
- **payout-created** — a payout/transfer was initiated;
- **in-transit** — payout sent, not yet confirmed at the destination;
- **paid** — payout confirmed at the destination account;
- **adjustment** — manual compensation, correction, or off-ledger movement.

If two amounts look similar, assume they may be different layers until proven
otherwise. Collapsing layers is how a dashboard lies without a single wrong query.

### 3. Dashboards must not induce wrong scaling decisions

If a screen makes a user believe they are profitable while the real ledger says
otherwise, that is a P0/P1 defect — not a styling ticket. A financial surface must make
explicit:

- what is commercial performance vs. what is actual balance;
- what has already been deducted (fees, refunds, disputes) vs. what has not;
- what is still in reconciliation or review;
- what has not yet become spendable money;
- what depends on a release rule (reserve, hold, settlement window).

Users decide traffic, hiring, and cash moves from these numbers. Financial confusion
costs real money, support load, and reputation. Optimize the number for correctness
first, then for clarity, then for looks.

### 4. Downstream data is a business decision

Events emitted to analytics, pixels, webhooks, or partner integrations are treated as
business decisions, not technical details. A wrong or duplicated purchase/refund event
can distort a user's ad optimization and cause real loss. Deduplicate, version, and
document the contract; a change to an emitted financial event is a P1 by default.

### 5. Financial divergence protocol

When there is any doubt about balance, payout, revenue, reserve, or "missing money",
do not answer on impulse. Run the protocol:

1. Do not assume the customer is wrong.
2. Do not assume the dashboard is right.
3. Do not assume the processor/acquirer is right without checking.
4. Fix the scope first: exact **period**, **account**, **store/project**, and **currency**.
5. Break the account into blocks and reconcile each: approved, settled,
   in-processing, refunds, chargebacks/disputes, fees, reserve, adjustments,
   available, payouts paid, payouts in-transit, and manual/off-ledger payments.
6. Produce a line-by-line reconciliation when the totals do not agree.
7. Explain the result in plain terms that do not hide the problem.
8. If the screen is wrong, fix the screen. If the money is wrong, quantify it, correct
   it, and document it.

Hard rule: **never call something a "visual bug" before it has been reconciled.** A
silent explanation protects you today and destroys trust later.

### 6. Money-handling essentials

Get the mechanics right or the money is wrong at the source:

- **Never use floating-point for monetary amounts.** Store and compute in minor units
  (integer cents) or a fixed-precision decimal type; binary floats silently lose cents.
- **Put an idempotency key on every money-moving mutation.** A retry, double-click, or
  webhook redelivery must collapse to exactly one charge, refund, or payout.
- **Verify every webhook and callback signature, and treat the payload as untrusted.**
  A processor callback is a public HTTP endpoint until proven authentic; validate before
  you act on it.

### Evidence and criticality for money

This preset raises the base gates for financial work:

- Anything touching money, balance, payout, checkout, or ledger is **P0/P1** — the
  full review + QA gate is mandatory, not optional.
- Financial conclusions must not close below **L3**; anything affecting payout, balance,
  or production money must reach **L4**, with a closed reconciliation.
- Prefer a dry-run or a read-only reconciliation before any money-moving mutation.
- Never invent amounts, rates, or reconciliations. State exactly what was not verified.

### Money-flow anti-patterns

The base "never introduce" list (unbounded retry, infinite polling, unthrottled fan-out,
messages that requeue forever, crash-on-missing-dependency) applies in full. Two failure
modes are money-specific and worse:

- a boot or dependency failure that degrades into silent double-charges or dropped
  transactions instead of failing loudly and cleanly;
- a **silent fallback that turns a financial error into a trustworthy-looking zero** —
  show the error state; never fabricate a clean number.
