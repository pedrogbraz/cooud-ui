import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveSafeDest } from "./utils.js";

const cwd = "/tmp/project";
const dir = "components/ui";

describe("resolveSafeDest (path-traversal containment)", () => {
  it("accepts a normal file directly under the target dir", () => {
    expect(resolveSafeDest(cwd, dir, "button.tsx")).toBe(resolve(cwd, dir, "button.tsx"));
  });

  it("accepts a nested path that stays inside the target dir", () => {
    expect(resolveSafeDest(cwd, dir, "primitives/button.tsx")).toBe(
      resolve(cwd, dir, "primitives/button.tsx"),
    );
  });

  it("rejects a '../escape' traversal path", () => {
    expect(() => resolveSafeDest(cwd, dir, "../escape")).toThrow(/outside target directory/);
  });

  it("rejects deep traversal that escapes the root", () => {
    expect(() => resolveSafeDest(cwd, dir, "../../../../etc/passwd")).toThrow(
      /outside target directory/,
    );
  });

  it("rejects an absolute path", () => {
    expect(() => resolveSafeDest(cwd, dir, "/etc/passwd")).toThrow(/absolute registry path/);
  });

  it("rejects traversal that re-enters via a sibling prefix", () => {
    // "components/ui-evil" must NOT be accepted as inside "components/ui".
    expect(() => resolveSafeDest(cwd, "components/ui", "../ui-evil/x.tsx")).toThrow(
      /outside target directory/,
    );
  });
});
