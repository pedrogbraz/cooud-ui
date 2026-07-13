# `@cooud-ui/ui` component authoring contract

Every component MUST follow this contract so the library stays consistent,
themeable, and tree-shakeable. Read this fully before writing a component.

## File layout
- One component family per file: `packages/ui/src/components/<name>.tsx`.
- Import the class merger: `import { cn } from "../lib/cn.js";` (note the `.js`).
- Export is wired centrally in `packages/ui/src/index.ts` — match the names there.

## Rules
1. **Semantic tokens only.** Never use raw Tailwind colors (`bg-zinc-900`,
   `text-white`, `border-gray-200`) or hardcoded hex. Use ONLY the token
   utilities below. This is what makes the whole library re-themeable.
2. **Variants via CVA.** Use `class-variance-authority`:
   `const xVariants = cva(base, { variants, defaultVariants })`. Export the
   variants object (e.g. `buttonVariants`) alongside the component.
3. **`forwardRef`** for every interactive/leaf element, with a correct DOM type.
4. **`data-slot="<name>"`** attribute on the root element of each component.
5. **`asChild` via `@radix-ui/react-slot`** for Button (and anything that should
   be able to render as a link).
6. **Accessibility:** real semantics, `focus-visible` ring, `aria-*` where
   relevant, `aria-busy`/`role` for Spinner/Skeleton. Disabled states use
   `disabled:opacity-50 disabled:pointer-events-none`.
7. **Focus ring pattern:** `outline-none focus-visible:ring-2
   focus-visible:ring-ring focus-visible:ring-offset-2
   focus-visible:ring-offset-surface-base`.
8. **TypeScript:** export a `XProps` type for components that take meaningful
   props. Use `verbatimModuleSyntax` — `import { type Foo }` / `export type`.
9. No client directive needed unless the component uses hooks/state. Leaf
   components (Button, Badge, Input, Card...) are server-safe — do NOT add
   `"use client"` to them.
10. **RTL-safe by default.** Anything directional uses logical utilities
    (`ps-*`/`pe-*`, `ms-*`/`me-*`, `start-*`/`end-*`, `text-start`/`text-end`,
    `rounded-s-*`/`rounded-e-*`, `border-s`/`border-e`) — never physical ones
    (`pl-*`, `left-*`, `text-left`, `rounded-l-*`...). If a transform is
    direction-sensitive and has no logical equivalent, add an explicit `rtl:`
    variant. Exception: styles keyed on a physical anchor (e.g. Radix
    `data-[side=left]`) stay physical — mark them with a comment.
11. **i18n.** No hardcoded user-facing strings inside components — expose a
    `labels` prop (or equivalent, e.g. `placeholder`) with English defaults.
    Locale-sensitive formatting goes through `Intl` or an injected locale
    (e.g. a `date-fns` `locale` prop), never a baked-in format.

## Token utility reference (resolve to `--cooud-*`, re-theme live)
Colors (use as `bg-*`, `text-*`, `border-*`, `ring-*`):
- `primary`, `primary-foreground`, `accent`, `accent-foreground`
- `surface-base`, `surface-inset`, `surface-raised`, `surface-overlay`,
  `surface-elevated`, `surface-floating`
- `fg`, `fg-secondary`, `fg-tertiary`, `fg-muted`, `fg-inverse`
  (text color = `text-fg`, `text-fg-secondary`, ...)
  - **`fg-muted` is for decorative / non-essential text only** — it does NOT
    meet WCAG AA (4.5:1) as small body text on every surface. Any
    information-bearing but de-emphasized text (labels, values, counts, hints
    the user must read) MUST use `fg-tertiary` or stronger. Reserve `fg-muted`
    for purely ornamental text (redundant annotations, watermark-style hints).
- `border`, `border-strong`, `border-soft`, `ring`
- `success`, `warning`, `error`, `info`
- **Accent/semantic AS TEXT:** `primary`, `success`, `warning`, `error`, and
  `info` are FILL colors and can read below WCAG AA (4.5:1) as small text — both
  on a plain surface in the bright/light themes AND, more subtly, as a same-hue
  label on their OWN `bg-<semantic>/15` tint (a badge chip). For links, labels,
  tinted-badge text, or syntax-highlighted values ALWAYS use the AA-tuned same-hue
  `*-strong` text variants, never the raw fill token:
  - `text-primary-strong` (token `primary-text`)
  - `text-success-strong` (token `success-text`)
  - `text-warning-strong` (token `warning-text`)
  - `text-error-strong` (token `error-text`)
  - `text-info-strong` (token `info-text`)

  Each is tuned to clear ≥4.5:1 on its WORST case (the `/15` tint over the
  lightest surface a badge lands on), so `bg-<semantic>/15 text-<semantic>-strong`
  is AA-safe on every theme/mode; where the raw color already clears AA as tint
  text, the variant equals it. Leave the raw fill tokens (`text-success`, etc.)
  only for icon/glyph fills, chart/sparkline strokes, and large decorative marks —
  NOT for small text. (Auditable: `node scripts/contrast.mjs` asserts every
  `*-strong` token on its `/15` tint across all 10 theme/modes.)

Radius: `rounded-sm | rounded-md | rounded-lg | rounded-xl | rounded-2xl |
rounded-3xl` (all derived from `--cooud-radius`; default control surface =
`rounded-lg`).

Shadow: `shadow-xs | shadow-sm | shadow-md | shadow-lg | shadow-glow`.

Fonts: `font-sans | font-display | font-mono`.

Gradients: `bg-gradient-primary`, `bg-gradient-aurora`.

## Canonical example — Button
```tsx
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../lib/cn.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background,box-shadow,transform] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-xs",
        secondary:
          "bg-surface-overlay text-fg border border-border hover:border-border-strong",
        ghost: "text-fg-secondary hover:bg-surface-overlay hover:text-fg",
        outline: "border border-border text-fg hover:bg-surface-overlay",
        destructive: "bg-error text-white hover:opacity-90 shadow-xs",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
```

## Verification
Do NOT run `bun install` or builds — the orchestrator does that once at the
end to avoid races. Just write correct, idiomatic source files.
