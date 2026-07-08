import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Magnetic } from "./magnetic.js";

// The attraction is gated on two media queries and driven by a rAF lerp, so the
// tests stub both: matchMedia with explicit flags (jsdom's own implementation
// always reports `matches: false`, which would enable the effect implicitly —
// stubbing keeps each case intentional) and a SYNCHRONOUS requestAnimationFrame
// so the lerp fully converges inside a single dispatched pointer event.
function stubMatchMedia({ reducedMotion = false, coarsePointer = false } = {}) {
  vi.stubGlobal("matchMedia", (query: string): MediaQueryList => {
    const matches = query.includes("prefers-reduced-motion")
      ? reducedMotion
      : query.includes("pointer: coarse")
        ? coarsePointer
        : false;
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  });
}

function stubSynchronousRaf() {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback): number => {
    callback(0);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
}

function getTarget(container: HTMLElement): HTMLElement {
  const target = container.querySelector('[data-slot="magnetic-target"]');
  if (!(target instanceof HTMLElement)) {
    throw new Error("magnetic-target not rendered");
  }
  return target;
}

function getWrapper(container: HTMLElement): HTMLElement {
  const wrapper = container.querySelector('[data-slot="magnetic"]');
  if (!(wrapper instanceof HTMLElement)) {
    throw new Error("magnetic wrapper not rendered");
  }
  return wrapper;
}

/** Parse `translate(Xpx, Ypx)` off the inline style the rAF loop writes. */
function translation(target: HTMLElement): { x: number; y: number } {
  const match = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(target.style.transform);
  if (!match) {
    throw new Error(`no translate in "${target.style.transform}"`);
  }
  return { x: Number.parseFloat(match[1] ?? "0"), y: Number.parseFloat(match[2] ?? "0") };
}

// jsdom rects are all zeros, so the wrapper's center sits at (0, 0) and the
// pointer's clientX/clientY ARE the offset from center — which makes the
// expected pull easy to compute: offset * strength * (1 - distance / radius).
async function hoverAt(wrapper: HTMLElement, x: number, y: number) {
  const user = userEvent.setup();
  await user.pointer({ target: wrapper, coords: { x, y, clientX: x, clientY: y } });
  return user;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Magnetic", () => {
  it("renders its children inside the wrapper and the transform target", () => {
    const { container } = render(
      <Magnetic>
        <button type="button">Hover me</button>
      </Magnetic>,
    );
    const wrapper = getWrapper(container);
    const target = getTarget(container);
    expect(wrapper).toContainElement(target);
    expect(target).toContainElement(screen.getByRole("button", { name: "Hover me" }));
  });

  it("pulls the content toward the pointer inside the field", async () => {
    stubMatchMedia();
    stubSynchronousRaf();
    const { container } = render(
      <Magnetic>
        <button type="button">CTA</button>
      </Magnetic>,
    );
    const wrapper = getWrapper(container);
    const target = getTarget(container);

    // offset (40, 30) → distance 50; falloff 1 - 50/120; strength 0.3
    await hoverAt(wrapper, 40, 30);
    expect(target).toHaveAttribute("data-magnetic-active", "true");
    const { x, y } = translation(target);
    expect(x).toBeCloseTo(40 * 0.3 * (1 - 50 / 120), 0);
    expect(y).toBeCloseTo(30 * 0.3 * (1 - 50 / 120), 0);
  });

  it("fades the pull to zero at the edge of the field", async () => {
    stubMatchMedia();
    stubSynchronousRaf();
    const { container } = render(
      <Magnetic radius={40}>
        <button type="button">CTA</button>
      </Magnetic>,
    );
    const wrapper = getWrapper(container);
    const target = getTarget(container);

    // Inside the 40px field at offset (30, 0): falloff 1 - 30/40 = 0.25.
    const user = await hoverAt(wrapper, 30, 0);
    expect(translation(target).x).toBeCloseTo(30 * 0.3 * 0.25, 0);

    // At/beyond the field's edge the pull is exactly zero — no pop.
    await user.pointer({ target: wrapper, coords: { x: 60, y: 0, clientX: 60, clientY: 0 } });
    expect(Math.abs(translation(target).x)).toBeLessThan(0.5);
  });

  it("clamps strength to the 0–1 range", async () => {
    stubMatchMedia();
    stubSynchronousRaf();
    const { container } = render(
      <Magnetic strength={5}>
        <button type="button">CTA</button>
      </Magnetic>,
    );
    const target = getTarget(container);

    await hoverAt(getWrapper(container), 40, 30);
    // strength 5 clamps to 1 → pull = offset * (1 - 50/120).
    expect(translation(target).x).toBeCloseTo(40 * (1 - 50 / 120), 0);
  });

  it("springs back to rest and re-enables the transition on leave", async () => {
    stubMatchMedia();
    stubSynchronousRaf();
    const { container } = render(
      <Magnetic>
        <button type="button">CTA</button>
      </Magnetic>,
    );
    const wrapper = getWrapper(container);
    const target = getTarget(container);

    const user = await hoverAt(wrapper, 40, 30);
    expect(target).toHaveAttribute("data-magnetic-active", "true");

    await user.pointer({ target: document.body });
    // The tracking attribute is gone (the CSS transition is live again) and the
    // transform is parked at zero — the transition animates the ride back.
    expect(target).not.toHaveAttribute("data-magnetic-active");
    expect(target.style.transform).toBe("translate(0px, 0px)");
  });

  it("never re-renders its children while tracking the pointer", async () => {
    stubMatchMedia();
    stubSynchronousRaf();
    let renders = 0;
    function Probe() {
      renders += 1;
      return <button type="button">CTA</button>;
    }
    const { container } = render(
      <Magnetic>
        <Probe />
      </Magnetic>,
    );
    const wrapper = getWrapper(container);

    const user = await hoverAt(wrapper, 40, 30);
    await user.pointer({ target: wrapper, coords: { x: 10, y: 80, clientX: 10, clientY: 80 } });
    await user.pointer({ target: document.body });
    expect(renders).toBe(1);
  });

  it("stays inert under prefers-reduced-motion", async () => {
    stubMatchMedia({ reducedMotion: true });
    stubSynchronousRaf();
    const { container } = render(
      <Magnetic>
        <button type="button">CTA</button>
      </Magnetic>,
    );
    const target = getTarget(container);

    await hoverAt(getWrapper(container), 40, 30);
    expect(target).not.toHaveAttribute("data-magnetic-active");
    expect(target.style.transform).toBe("");
  });

  it("stays inert on coarse pointers", async () => {
    stubMatchMedia({ coarsePointer: true });
    stubSynchronousRaf();
    const { container } = render(
      <Magnetic>
        <button type="button">CTA</button>
      </Magnetic>,
    );
    const target = getTarget(container);

    await hoverAt(getWrapper(container), 40, 30);
    expect(target).not.toHaveAttribute("data-magnetic-active");
    expect(target.style.transform).toBe("");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Magnetic>
        <button type="button">Começar agora</button>
      </Magnetic>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
