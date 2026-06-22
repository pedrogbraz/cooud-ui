import type { ReactNode } from "react";
import { DocsSidebar } from "../../components/docs/docs-sidebar";
import { MobileComponentNav } from "../../components/docs/mobile-component-nav";
import { SiteNav } from "../../components/site-nav";

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      <div className="mx-auto max-w-[90rem] px-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <DocsSidebar />
        <main id="main-content" className="min-w-0">
          <div className="py-4 lg:hidden">
            <MobileComponentNav />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
