"use client";

import { cn } from "@cooud/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "../../lib/components-index";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-12 pr-4 text-sm">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
          Overview
        </p>
        <SidebarLink href="/components" active={pathname === "/components"}>
          All Components
        </SidebarLink>

        {CATEGORIES.map((category) => (
          <div key={category.slug} className="mt-6">
            <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
              {category.name}
            </p>
            <ul>
              {category.items.map((item) => {
                const href = `/components/${item.slug}`;
                return (
                  <li key={item.slug}>
                    <SidebarLink href={href} active={pathname === href}>
                      {item.name}
                    </SidebarLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-3 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-surface-overlay font-medium text-fg"
          : "text-fg-secondary hover:bg-surface-overlay/60 hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
