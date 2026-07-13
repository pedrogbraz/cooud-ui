import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  type DescriptionListProps,
  DescriptionTerm,
  descriptionListVariants,
} from "./description-list.js";

/** A small raw-composition list (direct dt/dd children). */
function rawList(props: DescriptionListProps = {}) {
  return (
    <DescriptionList {...props}>
      <DescriptionTerm>Order</DescriptionTerm>
      <DescriptionDetails>#10245</DescriptionDetails>
      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>Paid</DescriptionDetails>
    </DescriptionList>
  );
}

/** The same content grouped with the convenience `DescriptionItem` wrapper. */
function itemList(props: DescriptionListProps = {}) {
  return (
    <DescriptionList {...props}>
      <DescriptionItem term="Order">#10245</DescriptionItem>
      <DescriptionItem term="Status">Paid</DescriptionItem>
    </DescriptionList>
  );
}

describe("DescriptionList", () => {
  it("renders a semantic dl/dt/dd structure with data-slots", () => {
    const { container } = render(rawList());

    const dl = container.querySelector("dl");
    expect(dl).toBeInTheDocument();
    expect(dl).toHaveAttribute("data-slot", "description-list");

    const terms = screen.getAllByRole("term");
    expect(terms).toHaveLength(2);
    expect(terms[0]?.tagName).toBe("DT");
    expect(terms[0]).toHaveAttribute("data-slot", "description-term");
    expect(terms[0]).toHaveTextContent("Order");

    const details = screen.getAllByRole("definition");
    expect(details).toHaveLength(2);
    expect(details[0]?.tagName).toBe("DD");
    expect(details[0]).toHaveAttribute("data-slot", "description-details");
    expect(details[0]).toHaveTextContent("#10245");
  });

  it("keeps the contract text colors on term and details", () => {
    render(rawList());
    expect(screen.getAllByRole("term")[0]).toHaveClass("text-fg-secondary");
    expect(screen.getAllByRole("definition")[0]).toHaveClass("text-fg");
  });

  it("groups a pair inside a div via DescriptionItem", () => {
    const { container } = render(itemList());

    const items = container.querySelectorAll('[data-slot="description-item"]');
    expect(items).toHaveLength(2);
    const first = items[0];
    expect(first?.tagName).toBe("DIV");
    // The wrapper holds exactly one dt followed by one dd (valid dl grouping).
    expect(first?.children).toHaveLength(2);
    expect(first?.children[0]?.tagName).toBe("DT");
    expect(first?.children[0]).toHaveTextContent("Order");
    expect(first?.children[1]?.tagName).toBe("DD");
    expect(first?.children[1]).toHaveTextContent("#10245");
  });

  it("defaults to the stacked layout at md size", () => {
    const { container } = render(rawList());
    const dl = container.querySelector("dl");
    expect(dl).toHaveClass("text-sm", "[&_dd]:mt-1", "[&>dt:not(:first-child)]:mt-4");
    expect(dl).not.toHaveClass("grid");
  });

  it("applies the horizontal layout: two-column grid rows with dividers", () => {
    const { container } = render(rawList({ layout: "horizontal" }));
    const dl = container.querySelector("dl");
    expect(dl).toHaveClass(
      "grid",
      "grid-cols-[fit-content(50%)_minmax(0,1fr)]",
      "[&>div]:grid-cols-subgrid",
      "[&_dt]:col-start-1",
      "[&_dd]:col-start-2",
      "[&>div:not(:first-child)]:border-t",
      "[&>dt:not(:first-child)]:border-t",
      "[&>dt:not(:first-child)+dd]:border-t",
    );
  });

  it("applies the grid layout: responsive card tiles", () => {
    const { container } = render(itemList({ layout: "grid" }));
    const dl = container.querySelector("dl");
    expect(dl).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
      "[&>div]:rounded-lg",
      "[&>div]:bg-surface-raised",
      "gap-4",
    );
  });

  it("scales density with the sm size", () => {
    const { container } = render(rawList({ layout: "horizontal", size: "sm" }));
    const dl = container.querySelector("dl");
    expect(dl).toHaveClass("text-xs", "[&_dt]:py-2", "[&_dd]:py-2");
    expect(dl).not.toHaveClass("text-sm");
  });

  it("tightens stacked group spacing at the sm size", () => {
    const { container } = render(rawList({ size: "sm" }));
    const dl = container.querySelector("dl");
    expect(dl).toHaveClass("[&>div:not(:first-child)]:mt-3", "[&>dt:not(:first-child)]:mt-3");
    expect(dl).not.toHaveClass("[&>dt:not(:first-child)]:mt-4");
  });

  it("tints alternate grouped rows when striped", () => {
    const { container } = render(itemList({ layout: "horizontal", striped: true }));
    expect(container.querySelector("dl")).toHaveClass(
      "[&>div:nth-of-type(even)]:bg-surface-inset",
      "[&_dt]:ps-3",
      "[&_dd]:pe-3",
    );
  });

  it("pads and rounds stacked zebra rows when striped", () => {
    const { container } = render(itemList({ striped: true }));
    expect(container.querySelector("dl")).toHaveClass(
      "[&>div]:rounded-md",
      "[&>div]:p-3",
      "[&>div:nth-of-type(even)]:bg-surface-inset",
    );
  });

  it("applies the grid striped and bordered compounds together", () => {
    const { container } = render(itemList({ layout: "grid", striped: true, bordered: true }));
    const dl = container.querySelector("dl");
    expect(dl).toHaveClass("[&>div:nth-of-type(even)]:bg-surface-inset");
    expect(dl).toHaveClass("p-4", "overflow-hidden", "rounded-lg", "border-border");
  });

  it("scopes the zebra to div-wrapped rows — raw pairs are never counted or tinted", () => {
    // The zebra selector targets only <div> row wrappers via nth-of-type, so
    // in the raw dt/dd composition nothing can match: striped is a no-op, as
    // the `striped` prop JSDoc documents.
    const { container } = render(rawList({ layout: "horizontal", striped: true }));
    const dl = container.querySelector("dl");
    expect(dl).toHaveClass("[&>div:nth-of-type(even)]:bg-surface-inset");
    expect(dl?.querySelectorAll(":scope > div")).toHaveLength(0);
  });

  it("draws an outer border when bordered", () => {
    const { container } = render(rawList({ bordered: true }));
    expect(container.querySelector("dl")).toHaveClass(
      "overflow-hidden",
      "rounded-lg",
      "border",
      "border-border",
    );
  });

  it("aligns the details column to the logical end via detailsAlign", () => {
    const { container } = render(rawList({ layout: "horizontal", detailsAlign: "end" }));
    expect(container.querySelector("dl")).toHaveClass("[&_dd]:text-end");
  });

  it("exposes the variants helper for composition", () => {
    expect(descriptionListVariants({ layout: "grid" })).toContain("sm:grid-cols-2");
  });

  it("merges custom classNames and forwards refs on every part", () => {
    const listRef = createRef<HTMLDListElement>();
    const itemRef = createRef<HTMLDivElement>();
    const { container } = render(
      <DescriptionList ref={listRef} className="max-w-md" aria-label="Order summary">
        <DescriptionItem ref={itemRef} term="Total" className="pb-2">
          $149.00
        </DescriptionItem>
      </DescriptionList>,
    );
    const dl = container.querySelector("dl");
    expect(listRef.current).toBe(dl);
    expect(dl).toHaveClass("max-w-md", "w-full");
    expect(dl).toHaveAttribute("aria-label", "Order summary");
    expect(itemRef.current).toBe(container.querySelector('[data-slot="description-item"]'));
    expect(itemRef.current).toHaveClass("pb-2", "min-w-0");
  });

  it("forwards refs and merges classNames on DescriptionTerm and DescriptionDetails", () => {
    const termRef = createRef<HTMLElement>();
    const detailsRef = createRef<HTMLElement>();
    render(
      <DescriptionList>
        <DescriptionTerm ref={termRef} className="uppercase">
          Plan
        </DescriptionTerm>
        <DescriptionDetails ref={detailsRef} className="tabular-nums">
          Pro
        </DescriptionDetails>
      </DescriptionList>,
    );
    expect(termRef.current).toBe(screen.getByRole("term"));
    expect(termRef.current).toHaveClass("uppercase", "font-medium", "text-fg-secondary");
    expect(detailsRef.current).toBe(screen.getByRole("definition"));
    expect(detailsRef.current).toHaveClass("tabular-nums", "min-w-0", "text-fg");
  });

  it("has no axe violations (raw dt/dd pairs)", async () => {
    const { container } = render(rawList({ layout: "horizontal", striped: true, bordered: true }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (DescriptionItem groups)", async () => {
    const { container } = render(itemList({ layout: "grid" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
