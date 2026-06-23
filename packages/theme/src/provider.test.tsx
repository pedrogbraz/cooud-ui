import type { ThemeOverrides } from "@cooud-ui/tokens";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CooudUIProvider } from "./provider.js";

const root = () => document.documentElement;

afterEach(() => {
  // The asRoot provider sets --cooud-* vars on <html> on mount and removes them
  // on unmount, but reset defensively so a failed assertion can't leak state.
  root().style.cssText = "";
});

describe("CooudUIProvider — reactive overrides", () => {
  it("applies the overrides prop to <html> when asRoot", () => {
    render(
      <CooudUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CooudUIProvider>,
    );

    expect(root().style.getPropertyValue("--cooud-radius")).toBe("20px");
  });

  it("does NOT loop or reset when re-rendered with a new object of equal content", () => {
    const { rerender } = render(
      <CooudUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CooudUIProvider>,
    );
    expect(root().style.getPropertyValue("--cooud-radius")).toBe("20px");

    // A brand-new object reference with identical content (the inline-object
    // case the provider must tolerate) — the var must stay put.
    rerender(
      <CooudUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CooudUIProvider>,
    );

    expect(root().style.getPropertyValue("--cooud-radius")).toBe("20px");
  });

  it("updates the CSS var when the overrides CONTENT changes", () => {
    const { rerender } = render(
      <CooudUIProvider asRoot overrides={{ radius: "20px" }}>
        <div>child</div>
      </CooudUIProvider>,
    );
    expect(root().style.getPropertyValue("--cooud-radius")).toBe("20px");

    const next: ThemeOverrides = { radius: "4px", primary: "oklch(0.6 0.2 30)" };
    rerender(
      <CooudUIProvider asRoot overrides={next}>
        <div>child</div>
      </CooudUIProvider>,
    );

    expect(root().style.getPropertyValue("--cooud-radius")).toBe("4px");
    expect(root().style.getPropertyValue("--cooud-primary")).toBe("oklch(0.6 0.2 30)");
  });
});
