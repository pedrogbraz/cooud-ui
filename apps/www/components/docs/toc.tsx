"use client";

import { cn } from "@cooud/ui";
import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
}

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-12 text-sm">
        <p className="flex items-center gap-2 pb-3 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
          On this page
        </p>
        <ul className="flex flex-col gap-1 border-l border-border">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  active === item.id
                    ? "border-primary font-medium text-fg"
                    : "border-transparent text-fg-tertiary hover:text-fg",
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
