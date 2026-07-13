import { describe, expect, it } from "vitest";
import {
  fixtureChromeSources,
  fixtureIndex,
  fixtureManifest,
  fixtureMeta,
} from "./compose.fixtures.js";
import { buildComposePlan } from "./plan.js";
import { renderPreview } from "./preview.js";

function plan() {
  return buildComposePlan(
    fixtureManifest(),
    { appName: "loja", brand: "Minha Loja", seed: 3 },
    fixtureIndex(),
    fixtureMeta(),
    fixtureChromeSources(),
  );
}

describe("renderPreview", () => {
  it("is deterministic (identical across runs)", () => {
    expect(renderPreview(plan())).toBe(renderPreview(plan()));
  });

  it("lists brand, seed, chrome, the page/block stack and nav", () => {
    const text = renderPreview(plan());
    expect(text).toContain("App: Shop (loja)");
    expect(text).toContain("Brand: Minha Loja");
    expect(text).toContain("Seed: 3");
    expect(text).toContain("(site) navbar=navbar footer=footer");
    expect(text).toContain("(bare) bare");
    expect(text).toContain('/  "Home"  (site) [nav: Home]');
    expect(text).toContain("- hero <HeroBlock> (section)");
    expect(text).toContain("- login <LoginBlock> (page)");
    expect(text).toContain("Nav: Home → /");
  });

  it("marks the selected variant in the block stack", () => {
    const m = fixtureManifest();
    m.manifest.pages[1]!.blocks = [{ block: "login", variant: "split" }];
    const withVariant = buildComposePlan(
      m,
      { appName: "loja" },
      fixtureIndex(),
      fixtureMeta(),
      fixtureChromeSources(),
    );
    expect(renderPreview(withVariant)).toContain(
      "- login (variant: split) <LoginSplitBlock> (page)",
    );
  });

  it("omits the seed line when no seed was given", () => {
    const noSeed = buildComposePlan(
      fixtureManifest(),
      { appName: "loja" },
      fixtureIndex(),
      fixtureMeta(),
      fixtureChromeSources(),
    );
    expect(renderPreview(noSeed)).not.toContain("Seed:");
  });
});
