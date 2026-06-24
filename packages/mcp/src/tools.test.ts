import { describe, expect, it } from "vitest";
import { RegistryClient, type RegistryIndex, type RegistryLoader } from "./registry.js";
import {
  buildInstallCommand,
  getComponent,
  getInstallCommand,
  humanizeName,
  listBlocks,
  listComponents,
  searchRegistry,
} from "./tools.js";

const INDEX: RegistryIndex = [
  { name: "cn", type: "registry:lib", dependencies: ["clsx@^2.1.1"], registryDependencies: [] },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot@^1.2.3", "class-variance-authority@^0.7.1"],
    registryDependencies: ["cn"],
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-alert-dialog@^1.1.14"],
    registryDependencies: ["button", "cn"],
  },
  {
    name: "pricing",
    type: "registry:block",
    dependencies: ["@cooud-ui/ui@0.1.0", "lucide-react@^0.577.0"],
    registryDependencies: [],
  },
];

const BUTTON_ITEM = {
  name: "button",
  type: "registry:ui" as const,
  dependencies: ["@radix-ui/react-slot@^1.2.3", "class-variance-authority@^0.7.1"],
  registryDependencies: ["cn"],
  files: [
    {
      path: "button.tsx",
      content: "export const Button = () => null;\n",
      target: "ui" as const,
    },
  ],
};

/** An in-memory loader so the tool logic is exercised without any network. */
function fixtureLoader(): RegistryLoader {
  return {
    async readJson<T>(file: string): Promise<T> {
      if (file === "index.json") return INDEX as unknown as T;
      if (file === "button.json") return BUTTON_ITEM as unknown as T;
      throw new Error(`registry fetch failed (404): ${file}`);
    },
  };
}

function client(): RegistryClient {
  return new RegistryClient(fixtureLoader());
}

describe("humanizeName", () => {
  it("title-cases hyphenated names", () => {
    expect(humanizeName("alert-dialog")).toBe("Alert Dialog");
    expect(humanizeName("button")).toBe("Button");
    expect(humanizeName("data-table")).toBe("Data Table");
  });
});

describe("buildInstallCommand", () => {
  it("builds the npx cooud-ui add command", () => {
    expect(buildInstallCommand(["button"])).toBe("npx cooud-ui add button");
    expect(buildInstallCommand(["button", "card", "dialog"])).toBe(
      "npx cooud-ui add button card dialog",
    );
  });

  it("de-duplicates and trims names while preserving order", () => {
    expect(buildInstallCommand([" button ", "card", "button"])).toBe(
      "npx cooud-ui add button card",
    );
  });

  it("throws when no usable names are given", () => {
    expect(() => buildInstallCommand([])).toThrow(/at least one/i);
    expect(() => buildInstallCommand(["  ", ""])).toThrow(/at least one/i);
  });
});

describe("listComponents", () => {
  it("returns only registry:ui items with the right shape", async () => {
    const result = await listComponents(client());
    expect(result.count).toBe(2);
    expect(result.items.map((i) => i.name)).toEqual(["button", "alert-dialog"]);
    expect(result.items.every((i) => i.type === "registry:ui")).toBe(true);
    // No registry:lib (cn) and no registry:block (pricing) leak in.
    expect(result.items.some((i) => i.name === "cn")).toBe(false);
    expect(result.items.some((i) => i.name === "pricing")).toBe(false);

    const button = result.items.find((i) => i.name === "button");
    expect(button).toMatchObject({
      name: "button",
      type: "registry:ui",
      title: "Button",
      registryDependencies: ["cn"],
      install: "npx cooud-ui add button",
    });
    expect(button?.dependencies).toContain("class-variance-authority@^0.7.1");
  });
});

describe("listBlocks", () => {
  it("returns only registry:block items", async () => {
    const result = await listBlocks(client());
    expect(result.count).toBe(1);
    expect(result.items[0]).toMatchObject({
      name: "pricing",
      type: "registry:block",
      title: "Pricing",
      install: "npx cooud-ui add pricing",
    });
  });
});

describe("searchRegistry", () => {
  it("fuzzy-matches components and blocks by name", async () => {
    const result = await searchRegistry(client(), "dialog");
    expect(result.query).toBe("dialog");
    expect(result.items.map((i) => i.name)).toEqual(["alert-dialog"]);
  });

  it("matches against the humanized title too", async () => {
    const result = await searchRegistry(client(), "Alert");
    expect(result.items.map((i) => i.name)).toEqual(["alert-dialog"]);
  });

  it("never returns the lib primitive (cn)", async () => {
    const result = await searchRegistry(client(), "cn");
    expect(result.items.some((i) => i.name === "cn")).toBe(false);
  });

  it("returns all components and blocks for an empty query", async () => {
    const result = await searchRegistry(client(), "");
    expect(result.count).toBe(3);
    expect(result.items.some((i) => i.name === "pricing")).toBe(true);
  });
});

describe("getComponent", () => {
  it("returns full detail incl. files, deps, and install command", async () => {
    const detail = await getComponent(client(), "button");
    expect(detail).toMatchObject({
      name: "button",
      type: "registry:ui",
      title: "Button",
      registryDependencies: ["cn"],
      install: "npx cooud-ui add button",
    });
    expect(detail.files).toHaveLength(1);
    expect(detail.files[0]?.path).toBe("button.tsx");
    expect(detail.files[0]?.content).toContain("export const Button");
  });

  it("propagates a helpful error for an unknown item", async () => {
    await expect(getComponent(client(), "does-not-exist")).rejects.toThrow(/404/);
  });

  it("caches items so a second call does not re-read", async () => {
    let reads = 0;
    const loader: RegistryLoader = {
      async readJson<T>(file: string): Promise<T> {
        reads += 1;
        if (file === "button.json") return BUTTON_ITEM as unknown as T;
        throw new Error(`unexpected ${file}`);
      },
    };
    const c = new RegistryClient(loader);
    await getComponent(c, "button");
    await getComponent(c, "button");
    expect(reads).toBe(1);
  });
});

describe("getInstallCommand", () => {
  it("returns the names and the composed command", () => {
    expect(getInstallCommand(["button", "card"])).toEqual({
      names: ["button", "card"],
      command: "npx cooud-ui add button card",
    });
  });
});
