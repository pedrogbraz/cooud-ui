import { Badge, cn } from "@cooud-ui/ui";
import { CalendarDays, CircleDot, GitBranch, Sparkles } from "lucide-react";
import { DocsHeader, DocsSection } from "../../components/docs/documentation";
import { SectionGlow } from "../../components/showcase-ui";
import { CHANGELOG_ENTRIES } from "../../lib/docs";

const statusTone = {
  Released: "border-success/30 bg-success/10 text-success",
  "In development": "border-primary/30 bg-primary/10 text-primary",
  Planned: "border-warning/30 bg-warning/10 text-warning",
};

export default function ChangelogPage() {
  return (
    <div className="relative py-10">
      {/* The same aurora top-edge shimmer the home sections carry — keeps the
          changelog header consistent with the rest of the showcase. */}
      <SectionGlow />
      <DocsHeader
        eyebrow="Changelog"
        title="A clean record of what shipped, what is in development, and what is next"
        description="Track component launches, Create updates, registry changes, accessibility work, and docs improvements in one place."
      />

      <DocsSection title="Release timeline">
        <div className="relative">
          <div
            className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-border"
            aria-hidden="true"
          />
          <div className="space-y-5">
            {CHANGELOG_ENTRIES.map((entry) => (
              <article key={`${entry.version}-${entry.title}`} className="relative pl-10">
                <span className="absolute left-0 top-6 grid size-9 place-items-center rounded-full border border-border bg-surface-raised text-primary">
                  <CircleDot className="size-4" aria-hidden="true" />
                </span>
                <div className="rounded-xl border border-border bg-surface-raised p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{entry.version}</Badge>
                    <span
                      className={cn(
                        "inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium",
                        statusTone[entry.status],
                      )}
                    >
                      {entry.status}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs tabular-nums text-fg-tertiary">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {entry.date}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-fg">
                    {entry.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-fg-secondary">
                    {entry.summary}
                  </p>

                  <ul className="mt-5 grid gap-2 md:grid-cols-3">
                    {entry.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 rounded-lg border border-border/70 bg-surface-inset px-3 py-2 text-sm text-fg-secondary"
                      >
                        <Sparkles
                          className="mt-0.5 size-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </DocsSection>

      <DocsSection
        title="Release policy"
        description="Every visible change should include a short entry so teams know whether it is ready to use, still in development, or planned."
      >
        <div className="rounded-xl border border-border bg-surface-raised p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-overlay text-primary">
              <GitBranch className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-fg-secondary">
              Component releases should mention docs, registry output, accessibility coverage, and
              migration notes when a change affects copied code or app-level setup.
            </p>
          </div>
        </div>
      </DocsSection>
    </div>
  );
}
