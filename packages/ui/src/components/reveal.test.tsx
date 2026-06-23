import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Reveal } from "./reveal.js";

// motion's useInView relies on IntersectionObserver, which jsdom does not
// implement — provide a minimal stub so the component can mount.
beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
});

describe("Reveal", () => {
  it("renders its children", () => {
    render(
      <Reveal>
        <p>Revealed content</p>
      </Reveal>,
    );
    expect(screen.getByText("Revealed content")).toBeInTheDocument();
  });

  it("tags the wrapper with its data-slot", () => {
    const { container } = render(
      <Reveal delay={0.2}>
        <span>x</span>
      </Reveal>,
    );
    expect(container.querySelector('[data-slot="reveal"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
