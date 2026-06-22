import type { ReactNode } from "react";
import {
  DocumentationSidebar,
  MobileDocumentationNav,
} from "../../components/docs/documentation-nav";
import { SiteNav } from "../../components/site-nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      <div className="mx-auto max-w-[90rem] px-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <DocumentationSidebar />
        <main className="min-w-0">
          <div className="py-4 lg:hidden">
            <MobileDocumentationNav />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
