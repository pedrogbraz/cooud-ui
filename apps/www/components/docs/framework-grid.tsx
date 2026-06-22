import { Atom, Boxes, CircleSlash, Rocket, Route, Zap } from "lucide-react";
import { FRAMEWORKS } from "../../lib/docs";
import { Checklist, InlineCode } from "./documentation";

const icons = {
  next: CircleSlash,
  vite: Zap,
  "tanstack-start": Atom,
  "react-router": Route,
  astro: Rocket,
  laravel: Boxes,
};

export function FrameworkGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {FRAMEWORKS.map((framework) => {
        const Icon = icons[framework.slug];

        return (
          <article
            key={framework.slug}
            className="rounded-xl border border-border bg-surface-raised p-6"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-overlay text-fg">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-fg">{framework.name}</h3>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">{framework.description}</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-border bg-surface-inset px-3 py-2">
              <InlineCode>{framework.command}</InlineCode>
            </div>

            <div className="mt-5">
              <Checklist items={framework.checks} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
