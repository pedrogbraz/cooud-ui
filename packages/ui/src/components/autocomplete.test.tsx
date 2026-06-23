import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Autocomplete, type AutocompleteOption } from "./autocomplete.js";

// Radix Popover + cmdk rely on browser APIs jsdom does not implement.
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

const CITIES: AutocompleteOption[] = [
  { value: "lisbon", label: "Lisbon" },
  { value: "lima", label: "Lima" },
  { value: "london", label: "London" },
];

describe("Autocomplete", () => {
  it("renders a combobox input with its placeholder", () => {
    render(<Autocomplete options={CITIES} aria-label="City" placeholder="Type a city…" />);
    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Type a city…");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and filters suggestions as the user types", async () => {
    render(<Autocomplete options={CITIES} aria-label="City" />);
    const input = screen.getByRole("combobox", { name: "City" });
    await userEvent.type(input, "lo");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("option", { name: "London" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Lima" })).not.toBeInTheDocument();
  });

  it("commits a suggestion on click and reports it", async () => {
    const onSelect = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Autocomplete
        options={CITIES}
        aria-label="City"
        onSelect={onSelect}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("combobox", { name: "City" });
    await userEvent.type(input, "li");
    await userEvent.click(await screen.findByRole("option", { name: "Lisbon" }));

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "lisbon" }));
    await waitFor(() => expect(input).toHaveValue("Lisbon"));
  });

  it("supports a controlled value", () => {
    function Controlled() {
      const [value] = useState("Lima");
      return (
        <Autocomplete options={CITIES} aria-label="City" value={value} onValueChange={() => {}} />
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("combobox", { name: "City" })).toHaveValue("Lima");
  });

  it("resolves async suggestions via onSearch", async () => {
    const onSearch = vi.fn(async (q: string) =>
      CITIES.filter((c) => (c.label ?? "").toLowerCase().includes(q.toLowerCase())),
    );
    render(<Autocomplete aria-label="City" onSearch={onSearch} debounceMs={0} />);
    await userEvent.type(screen.getByRole("combobox", { name: "City" }), "lon");
    expect(await screen.findByRole("option", { name: "London" })).toBeInTheDocument();
    expect(onSearch).toHaveBeenCalled();
  });

  it("does not open while disabled", async () => {
    render(<Autocomplete options={CITIES} aria-label="City" disabled />);
    const input = screen.getByRole("combobox", { name: "City" });
    expect(input).toBeDisabled();
    await userEvent.type(input, "lo");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("forwards aria-invalid onto the input", () => {
    render(<Autocomplete options={CITIES} aria-label="City" aria-invalid />);
    expect(screen.getByRole("combobox", { name: "City" })).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations (closed)", async () => {
    const { container } = render(<Autocomplete options={CITIES} aria-label="City" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
