import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TableOfContents } from "./table-of-contents.js";

type ObserverRecord = {
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;
  observed: Element[];
};

const observers: ObserverRecord[] = [];

// jsdom does not implement IntersectionObserver — capture the callback and the
// observed targets so tests can drive the scrollspy by hand.
class IntersectionObserverStub {
  observed: Element[] = [];

  constructor(
    private readonly callback: IntersectionObserverCallback,
    private readonly options?: IntersectionObserverInit,
  ) {
    observers.push({ callback: this.callback, options: this.options, observed: this.observed });
  }

  observe(target: Element) {
    this.observed.push(target);
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function intersect(entries: Array<{ target: Element; isIntersecting: boolean }>) {
  const record = observers.at(-1);
  if (!record) throw new Error("no IntersectionObserver was created");
  act(() => {
    record.callback(
      entries as unknown as IntersectionObserverEntry[],
      record as unknown as IntersectionObserver,
    );
  });
}

function domRect(top: number, height = 40): DOMRect {
  return {
    top,
    bottom: top + height,
    height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

const ITEMS = [
  { id: "intro", label: "Introduction" },
  { id: "usage", label: "Usage", depth: 1 },
  { id: "api", label: "API reference", depth: 1 },
];

function Article() {
  return (
    <article>
      <h2 id="intro">Introduction</h2>
      <h3 id="usage">Usage</h3>
      <h3 id="api">API reference</h3>
    </article>
  );
}

describe("TableOfContents", () => {
  it("renders a labelled nav with one depth-indented link per item", () => {
    render(
      <>
        <Article />
        <TableOfContents items={ITEMS} />
      </>,
    );

    const nav = screen.getByRole("navigation", { name: "On this page" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "#intro");
    expect(links[0]).toHaveAttribute("data-depth", "0");
    expect(links[1]).toHaveAttribute("href", "#usage");
    expect(links[1]).toHaveAttribute("data-depth", "1");
    // Nothing is active until the observer reports an intersection.
    for (const link of links) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("auto-discovers headings with ids inside the container when items are omitted", () => {
    render(
      <>
        <div id="doc">
          <h2 id="one">One</h2>
          <h3 id="two">Two</h3>
          <h3>No id, skipped</h3>
        </div>
        <TableOfContents containerId="doc" />
      </>,
    );

    const nav = screen.getByRole("navigation", { name: "On this page" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("One");
    expect(links[0]).toHaveAttribute("data-depth", "0");
    expect(links[1]).toHaveTextContent("Two");
    // h3 relative to the shallowest discovered level (h2) → depth 1.
    expect(links[1]).toHaveAttribute("data-depth", "1");
  });

  it("marks the topmost heading in the activation band as the current location", () => {
    render(
      <>
        <Article />
        <TableOfContents items={ITEMS} />
      </>,
    );
    const intro = document.getElementById("intro") as HTMLElement;
    const usage = document.getElementById("usage") as HTMLElement;

    intersect([{ target: intro, isIntersecting: true }]);
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    // Two headings in the band: the first in document order stays active.
    intersect([{ target: usage, isIntersecting: true }]);
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    // The first one scrolls out above: the next heading takes over.
    intersect([{ target: intro, isIntersecting: false }]);
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Introduction" })).not.toHaveAttribute("aria-current");
  });

  it("keeps the section whose heading last crossed above the band active when the band empties", () => {
    render(
      <>
        <Article />
        <TableOfContents items={ITEMS} />
      </>,
    );
    const intro = document.getElementById("intro") as HTMLElement;
    const usage = document.getElementById("usage") as HTMLElement;
    const api = document.getElementById("api") as HTMLElement;

    // Deep inside the "Usage" body: both earlier headings sit above the
    // viewport, the next one is far below — nothing intersects the band.
    vi.spyOn(intro, "getBoundingClientRect").mockReturnValue(domRect(-400));
    vi.spyOn(usage, "getBoundingClientRect").mockReturnValue(domRect(-80));
    vi.spyOn(api, "getBoundingClientRect").mockReturnValue(domRect(600));

    intersect([{ target: usage, isIntersecting: false }]);
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("aria-current", "location");
  });

  it("moves the indicator bar to the active row", () => {
    const { container } = render(
      <>
        <Article />
        <TableOfContents items={ITEMS} />
      </>,
    );
    const indicator = container.querySelector<HTMLElement>(
      '[data-slot="table-of-contents-indicator"]',
    );
    expect(indicator).not.toBeNull();
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator?.style.opacity).toBe("0");

    intersect([{ target: document.getElementById("api") as HTMLElement, isIntersecting: true }]);
    expect(indicator?.style.opacity).toBe("1");
    expect(indicator?.style.transform).toMatch(/^translateY\(/);
  });

  it("smooth-scrolls to the section on click and activates it optimistically", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <>
        <Article />
        <TableOfContents items={ITEMS} offset={64} />
      </>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Usage" }));

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("aria-current", "location");
    expect(window.location.hash).toBe("#usage");
  });

  it("scrolls instantly when the visitor prefers reduced motion", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: true } as unknown as MediaQueryList),
    );
    render(
      <>
        <Article />
        <TableOfContents items={ITEMS} />
      </>,
    );

    fireEvent.click(screen.getByRole("link", { name: "API reference" }));

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });

  it("leaves modified clicks to the browser (open in new tab)", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <>
        <Article />
        <TableOfContents items={ITEMS} />
      </>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Usage" }), { metaKey: true });

    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Usage" })).not.toHaveAttribute("aria-current");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Article />
        <TableOfContents items={ITEMS} />
      </>,
    );
    intersect([{ target: document.getElementById("intro") as HTMLElement, isIntersecting: true }]);
    expect(await axe(container)).toHaveNoViolations();
  });
});
