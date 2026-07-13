import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { FileDropzone } from "./file-dropzone.js";

afterEach(() => {
  vi.restoreAllMocks();
});

function makeFile(name: string) {
  return new File(["data"], name, { type: "text/plain" });
}

describe("FileDropzone", () => {
  it("names the file input by default so it is never nameless", () => {
    render(<FileDropzone onFiles={() => {}} />);
    // getByLabelText resolves the accessible name of the single file input.
    expect(screen.getByLabelText("Upload files")).toBeInTheDocument();
  });

  it("honors a custom aria-label", () => {
    render(<FileDropzone aria-label="Upload attachments" onFiles={() => {}} />);
    expect(screen.getByLabelText("Upload attachments")).toBeInTheDocument();
  });

  it("wraps the input in a label with no nested interactive role", () => {
    const { container } = render(<FileDropzone onFiles={() => {}} />);
    const root = container.querySelector('[data-slot="file-dropzone"]');
    // The accessible dropzone pattern is a <label>, not a role=button div.
    expect(root?.tagName).toBe("LABEL");
    expect(root).not.toHaveAttribute("role");
    expect(root).not.toHaveAttribute("tabindex");

    // The label contains exactly one focusable control: the file input itself,
    // so there is no nested-interactive violation.
    const input = within(root as HTMLElement).getByLabelText("Upload files");
    expect(input).toHaveAttribute("type", "file");
    expect(input).not.toHaveAttribute("tabindex", "-1");
    expect(root?.querySelectorAll("button, [role='button'], [tabindex]")).toHaveLength(0);
  });

  it("is keyboard-focusable — tab lands on the native file input", async () => {
    render(<FileDropzone onFiles={() => {}} />);
    const input = screen.getByLabelText("Upload files");
    await userEvent.tab();
    // The native file input takes focus; Enter/Space then open the OS picker
    // natively (no synthetic role=button handler needed).
    expect(input).toHaveFocus();
  });

  it("opens the picker when the label surface is clicked", () => {
    const { container } = render(<FileDropzone onFiles={() => {}} />);
    const root = container.querySelector('[data-slot="file-dropzone"]') as HTMLElement;
    const input = screen.getByLabelText("Upload files");
    const onInputClick = vi.fn();
    input.addEventListener("click", onInputClick);
    // The native <label> forwards its activation to the labeled input, so a
    // click anywhere on the drop surface opens the picker — no synthetic
    // role=button onClick handler needed.
    fireEvent.click(root);
    expect(onInputClick).toHaveBeenCalled();
  });

  it("emits picked files and resets the input value", () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} />);
    const input = screen.getByLabelText("Upload files") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("a.txt")] } });
    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(["a.txt"]);
    // Value is cleared so re-selecting the same file fires change again.
    expect(input.value).toBe("");
  });

  it("emits dropped files", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDropzone multiple onFiles={onFiles} />);
    const root = container.querySelector('[data-slot="file-dropzone"]') as HTMLElement;
    fireEvent.drop(root, {
      dataTransfer: { files: [makeFile("a.txt"), makeFile("b.txt")] },
    });
    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(["a.txt", "b.txt"]);
  });

  it("marks dragging state on drag over and clears it on leave", () => {
    const { container } = render(<FileDropzone onFiles={() => {}} />);
    const root = container.querySelector('[data-slot="file-dropzone"]') as HTMLElement;
    fireEvent.dragOver(root, { dataTransfer: { files: [] } });
    expect(root).toHaveAttribute("data-dragging", "true");
    fireEvent.dragLeave(root, { dataTransfer: { files: [] } });
    expect(root).toHaveAttribute("data-dragging", "false");
  });

  it("does not accept files while disabled", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDropzone disabled onFiles={onFiles} />);
    const root = container.querySelector('[data-slot="file-dropzone"]') as HTMLElement;
    expect(screen.getByLabelText("Upload files")).toBeDisabled();
    expect(root).toHaveAttribute("aria-disabled", "true");
    fireEvent.drop(root, { dataTransfer: { files: [makeFile("a.txt")] } });
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<FileDropzone aria-label="Upload files" onFiles={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
