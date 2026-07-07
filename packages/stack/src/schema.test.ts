import { describe, expect, it } from "vitest";
import { catalog } from "./catalog.js";
import { STACK_SCHEMA, STACK_SCHEMA_EXAMPLE } from "./schema.js";

describe("stack schema", () => {
  it("example stack includes every required catalog category", () => {
    expect(Object.keys(STACK_SCHEMA_EXAMPLE.stack).sort()).toEqual(
      catalog.map((category) => category.id).sort(),
    );
  });

  it("schema required list tracks the catalog categories", () => {
    const schema = STACK_SCHEMA as { properties: { stack: { required?: string[] } } };
    expect(schema.properties.stack.required?.sort()).toEqual(
      catalog.map((category) => category.id).sort(),
    );
  });
});
