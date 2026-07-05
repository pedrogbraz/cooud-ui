import { describe, expect, it } from "vitest";
import { parseCli } from "./index.js";
import { dirNameFromProjectName, isValidProjectName } from "./utils.js";

describe("isValidProjectName", () => {
  it("accepts simple lowercase names", () => {
    expect(isValidProjectName("my-app")).toBe(true);
    expect(isValidProjectName("my_app.v2")).toBe(true);
  });

  it("accepts scoped names", () => {
    expect(isValidProjectName("@acme/widget")).toBe(true);
  });

  it("rejects empty, uppercase, leading-dot, and space-containing names", () => {
    expect(isValidProjectName("")).toBe(false);
    expect(isValidProjectName("MyApp")).toBe(false);
    expect(isValidProjectName(".hidden")).toBe(false);
    expect(isValidProjectName("my app")).toBe(false);
    expect(isValidProjectName("a/b/c")).toBe(false);
  });
});

describe("dirNameFromProjectName", () => {
  it("returns the name unchanged when unscoped", () => {
    expect(dirNameFromProjectName("my-app")).toBe("my-app");
  });

  it("strips the scope for scoped names", () => {
    expect(dirNameFromProjectName("@acme/widget")).toBe("widget");
  });
});

describe("parseCli", () => {
  it("reads the positional name and defaults install to true", () => {
    expect(parseCli(["my-app"])).toEqual({
      name: "my-app",
      pm: undefined,
      install: true,
      theme: undefined,
      mode: undefined,
      yes: false,
    });
  });

  it("honors --no-install and --pm", () => {
    expect(parseCli(["my-app", "--no-install", "--pm", "pnpm"])).toEqual({
      name: "my-app",
      pm: "pnpm",
      install: false,
      theme: undefined,
      mode: undefined,
      yes: false,
    });
  });

  it("parses --theme, --mode and --yes", () => {
    expect(parseCli(["my-app", "--theme", "sunset", "--mode", "light", "--yes"])).toEqual({
      name: "my-app",
      pm: undefined,
      install: true,
      theme: "sunset",
      mode: "light",
      yes: true,
    });
  });

  it("throws on an unknown --pm", () => {
    expect(() => parseCli(["my-app", "--pm", "cargo"])).toThrow(/Unknown --pm/);
  });

  it("throws on an unknown --theme", () => {
    expect(() => parseCli(["my-app", "--theme", "galaxy"])).toThrow(/Unknown --theme/);
  });

  it("throws on an unknown --mode", () => {
    expect(() => parseCli(["my-app", "--mode", "sepia"])).toThrow(/Unknown --mode/);
  });
});
