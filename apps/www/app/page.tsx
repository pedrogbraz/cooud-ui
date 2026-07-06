import { Hero } from "../components/hero";
import { ComponentShowcase } from "../components/home/component-showcase";
import { FeatureGrid } from "../components/home/feature-grid";
import { GetStarted } from "../components/home/get-started";
import { LiveTheming } from "../components/home/live-theming";
import { SiteFooter } from "../components/home/site-footer";
import { SiteNav } from "../components/site-nav";

export default function Page() {
  return (
    <div className="min-h-screen bg-surface-base text-fg">
      <SiteNav />
      <main id="main-content">
        {/* Pitch */}
        <Hero />
        {/* Show, don't tell: the whole page re-themes live. */}
        <LiveTheming />
        {/* The pillars. */}
        <FeatureGrid />
        {/* The breadth — every component, live. */}
        <ComponentShowcase />
        {/* Two ways in + the final call to action. */}
        <GetStarted />
      </main>
      <SiteFooter />
    </div>
  );
}
