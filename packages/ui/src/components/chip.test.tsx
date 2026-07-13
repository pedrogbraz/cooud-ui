import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Heart } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Chip, ChipGroup } from "./chip.js";

describe("Chip", () => {
  it("renders a static chip as a <span> with the soft neutral defaults", () => {
    render(<Chip>Static</Chip>);
    const chip = screen.getByText("Static");
    expect(chip.tagName).toBe("SPAN");
    expect(chip).toHaveAttribute("data-slot", "chip");
    expect(chip).not.toHaveAttribute("aria-pressed");
    expect(chip.className).toContain("rounded-full");
    expect(chip.className).toContain("bg-surface-overlay");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies the variant × color recipes", () => {
    render(
      <>
        <Chip variant="solid" color="primary">
          solid-primary
        </Chip>
        <Chip variant="solid" color="success">
          solid-success
        </Chip>
        <Chip variant="soft" color="success">
          soft-success
        </Chip>
        <Chip variant="outline" color="error">
          outline-error
        </Chip>
      </>,
    );
    const solidPrimary = screen.getByText("solid-primary").className;
    expect(solidPrimary).toContain("bg-primary");
    expect(solidPrimary).toContain("text-primary-foreground");
    // Semantic solid fills darken toward black so white text clears AA.
    const solidSuccess = screen.getByText("solid-success").className;
    expect(solidSuccess).toContain("color-mix");
    expect(solidSuccess).toContain("text-white");
    // Tinted chips carry the AA-tuned `*-strong` text tokens, never raw fills.
    const softSuccess = screen.getByText("soft-success").className;
    expect(softSuccess).toContain("bg-success/15");
    expect(softSuccess).toContain("text-success-strong");
    const outlineError = screen.getByText("outline-error").className;
    expect(outlineError).toContain("border-error/50");
    expect(outlineError).toContain("text-error-strong");
  });

  it("applies the size presets", () => {
    render(
      <>
        <Chip size="sm">small</Chip>
        <Chip size="lg">large</Chip>
      </>,
    );
    expect(screen.getByText("small").className).toContain("h-6");
    expect(screen.getByText("large").className).toContain("h-8");
  });

  it("renders as a type=button and fires onClick when interactive", async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Filter</Chip>);
    const chip = screen.getByRole("button", { name: "Filter" });
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).not.toHaveAttribute("aria-pressed");
    await userEvent.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("activates with Enter and Space from the keyboard", async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Key</Chip>);
    screen.getByRole("button", { name: "Key" }).focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("exposes the selected state via aria-pressed and a check mark", () => {
    const { container, rerender } = render(
      <Chip selected onClick={() => {}}>
        Vegan
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Vegan" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(chip).toHaveAttribute("data-selected");
    expect(container.querySelector('[data-slot="chip-check"]')).not.toBeNull();

    rerender(
      <Chip selected={false} onClick={() => {}}>
        Vegan
      </Chip>,
    );
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).not.toHaveAttribute("data-selected");
    expect(container.querySelector('[data-slot="chip-check"]')).toBeNull();
  });

  it("attaches no event handlers to a selected-only chip (server-component safe)", () => {
    render(<Chip selected>Applied</Chip>);
    const chip = screen.getByRole("button", { name: "Applied" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    // A selected-but-handler-less chip is reachable from a React Server
    // Component (`selected` is just a serializable boolean), and RSC throws on
    // function props for host elements. React stores the props it applied to a
    // DOM node under an internal `__reactProps$` key — assert no handler landed
    // on the host <button>.
    const propsKey = Object.keys(chip).find((key) => key.startsWith("__reactProps$"));
    expect(propsKey).toBeDefined();
    const hostProps = (chip as unknown as Record<string, Record<string, unknown>>)[
      propsKey as string
    ];
    expect(hostProps.onClick).toBeUndefined();
    expect(hostProps.onKeyDown).toBeUndefined();
  });

  it("keeps × removal working on a selected chip without onClick", async () => {
    const onRemove = vi.fn();
    const { container } = render(
      <Chip selected onRemove={onRemove}>
        Removable
      </Chip>,
    );
    // Dismissible interactive chips still need the composite click handler.
    const remove = container.querySelector('[data-slot="chip-remove"]') as HTMLElement;
    expect(remove.tagName).toBe("SPAN");
    await userEvent.click(remove);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("toggles a controlled selection on click", async () => {
    function Toggleable() {
      const [on, setOn] = useState(false);
      return (
        <Chip selected={on} onClick={() => setOn((value) => !value)}>
          Gluten-free
        </Chip>
      );
    }
    render(<Toggleable />);
    const chip = screen.getByRole("button", { name: "Gluten-free" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("renders an accessible remove button on a non-interactive chip", async () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Draft</Chip>);
    // The chip root stays a span; the only button is the remove control.
    expect(screen.getByText("Draft").tagName).toBe("SPAN");
    const removeButton = screen.getByRole("button", { name: "Remove" });
    await userEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("localizes the remove label via the labels prop", () => {
    render(
      <Chip onRemove={() => {}} labels={{ remove: "Remover" }}>
        PT
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
  });

  it("removes without triggering the chip's own onClick when interactive", async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <Chip onClick={onClick} onRemove={onRemove}>
        Combo
      </Chip>,
    );
    // No nested <button>: the remove affordance is a decorative span.
    expect(screen.getAllByRole("button")).toHaveLength(1);
    const remove = container.querySelector('[data-slot="chip-remove"]') as HTMLElement;
    expect(remove.tagName).toBe("SPAN");
    expect(remove).toHaveAttribute("aria-hidden", "true");

    await userEvent.click(remove);
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Combo" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("removes the focused chip with Delete and Backspace", async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <Chip onClick={onClick} onRemove={onRemove}>
        Tag
      </Chip>,
    );
    screen.getByRole("button", { name: "Tag" }).focus();
    await userEvent.keyboard("{Delete}");
    expect(onRemove).toHaveBeenCalledTimes(1);
    await userEvent.keyboard("{Backspace}");
    expect(onRemove).toHaveBeenCalledTimes(2);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("composes a consumer onKeyDown and lets preventDefault suppress removal", async () => {
    const onRemove = vi.fn();
    const onKeyDown = vi.fn((event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Delete") event.preventDefault();
    });
    render(
      <Chip onClick={() => {}} onRemove={onRemove} onKeyDown={onKeyDown}>
        Guarded
      </Chip>,
    );
    screen.getByRole("button", { name: "Guarded" }).focus();
    // The consumer handler runs first; its preventDefault vetoes removal.
    await userEvent.keyboard("{Delete}");
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onRemove).not.toHaveBeenCalled();
    // An unprevented key still removes.
    await userEvent.keyboard("{Backspace}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("keeps removal clicks from reaching ancestor click handlers in both modes", async () => {
    const onAncestorClick = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      // biome-ignore lint/a11y/useKeyWithClickEvents: test scaffolding — an ancestor listener observing bubbled clicks, not a control.
      // biome-ignore lint/a11y/noStaticElementInteractions: same — the div only records event propagation in this test.
      <div onClick={onAncestorClick}>
        <Chip onClick={() => {}} onRemove={onRemove}>
          Interactive
        </Chip>
        <Chip onRemove={onRemove}>Static</Chip>
      </div>,
    );
    const removes = container.querySelectorAll('[data-slot="chip-remove"]');
    expect(removes).toHaveLength(2);
    await userEvent.click(removes[0] as HTMLElement);
    await userEvent.click(removes[1] as HTMLElement);
    expect(onRemove).toHaveBeenCalledTimes(2);
    expect(onAncestorClick).not.toHaveBeenCalled();
  });

  it("announces removal on interactive chips via keyshortcuts and a description", () => {
    render(
      <Chip onClick={() => {}} onRemove={() => {}}>
        Combo
      </Chip>,
    );
    // The accessible name stays the label alone; the removal hint rides
    // aria-keyshortcuts plus the described-by hidden hint instead.
    const chip = screen.getByRole("button", { name: "Combo" });
    expect(chip).toHaveAttribute("aria-keyshortcuts", "Delete Backspace");
    const hintId = chip.getAttribute("aria-describedby") as string;
    expect(hintId).toBeTruthy();
    expect(document.getElementById(hintId)).toHaveTextContent("Remove: Delete");
    expect(chip).toHaveAccessibleDescription("Remove: Delete");
  });

  it("localizes the interactive removal hint via labels.remove", () => {
    render(
      <Chip onClick={() => {}} onRemove={() => {}} labels={{ remove: "Remover" }}>
        PT
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "PT" })).toHaveAccessibleDescription(
      "Remover: Delete",
    );
  });

  it("adds no removal hint when the chip is not dismissible", () => {
    render(<Chip onClick={() => {}}>Plain</Chip>);
    const chip = screen.getByRole("button", { name: "Plain" });
    expect(chip).not.toHaveAttribute("aria-keyshortcuts");
    expect(chip).not.toHaveAttribute("aria-describedby");
  });

  it("does not fire onClick or onRemove while disabled", async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <Chip onClick={onClick} onRemove={onRemove} disabled>
        Off
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "Off" });
    expect(chip).toBeDisabled();
    await userEvent.click(chip);
    chip.focus();
    await userEvent.keyboard("{Delete}");
    expect(onClick).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("keeps the remove span inert on a disabled interactive chip", async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <Chip onClick={onClick} onRemove={onRemove} disabled>
        Frozen
      </Chip>,
    );
    // The span lives inside a natively disabled <button>, so no click event
    // ever fires from it.
    const remove = container.querySelector('[data-slot="chip-remove"]') as HTMLElement;
    await userEvent.click(remove);
    expect(onRemove).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables the remove button and marks the root on a disabled static chip", async () => {
    const onRemove = vi.fn();
    render(
      <Chip onRemove={onRemove} disabled>
        Locked
      </Chip>,
    );
    const chip = screen.getByText("Locked");
    expect(chip.tagName).toBe("SPAN");
    // Spans have no native disabled state; the styling hook is data-disabled.
    expect(chip).toHaveAttribute("data-disabled");
    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toBeDisabled();
    await userEvent.click(removeButton);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("promotes selected={false} without onClick to an unpressed <button>", () => {
    // The documented contract: ANY non-undefined `selected` renders a button.
    render(<Chip selected={false}>Idle</Chip>);
    const chip = screen.getByRole("button", { name: "Idle" });
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).not.toHaveAttribute("data-selected");
  });

  it("renders the leading icon and avatar slots", () => {
    const { container } = render(
      <Chip icon={<Heart data-testid="heart" />} avatar={<img alt="" src="data:," />}>
        With slots
      </Chip>,
    );
    expect(screen.getByTestId("heart")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chip-icon"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="chip-avatar"]')).not.toBeNull();
  });

  it("has no axe violations (static + dismissible)", async () => {
    const { container } = render(
      <ChipGroup aria-label="Statuses">
        <Chip variant="soft" color="success">
          Paid
        </Chip>
        <Chip variant="solid" color="error">
          Overdue
        </Chip>
        <Chip onRemove={() => {}}>Dismissible</Chip>
      </ChipGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (interactive, selected, dismissible)", async () => {
    const { container } = render(
      <ChipGroup aria-label="Filters">
        <Chip selected onClick={() => {}}>
          Active
        </Chip>
        <Chip selected={false} onClick={() => {}} onRemove={() => {}}>
          Inactive
        </Chip>
      </ChipGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ChipGroup", () => {
  it("renders a labelled group that wraps its chips", () => {
    render(
      <ChipGroup aria-label="Topics" className="gap-4">
        <Chip>One</Chip>
        <Chip>Two</Chip>
      </ChipGroup>,
    );
    const group = screen.getByRole("group", { name: "Topics" });
    expect(group).toHaveAttribute("data-slot", "chip-group");
    expect(group).toContainElement(screen.getByText("One"));
    expect(group).toContainElement(screen.getByText("Two"));
    // Consumer classes merge over the defaults.
    expect(group.className).toContain("flex-wrap");
    expect(group.className).toContain("gap-4");
    expect(group.className).not.toContain("gap-2");
  });
});
