import type { ReactNode } from "react";
import { SiteNav } from "../../components/site-nav";

export default function BlocksLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      {children}
    </div>
  );
}
