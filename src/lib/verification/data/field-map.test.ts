import { describe, expect, it } from "vitest";
import {
  EXAMPLE_FIELD_MAP,
  parseFieldMapDocument,
} from "./field-map";

describe("parseFieldMapDocument", () => {
  it("accepts the shipped example", () => {
    expect(parseFieldMapDocument(EXAMPLE_FIELD_MAP)).toEqual(EXAMPLE_FIELD_MAP);
  });

  it("rejects edges that reference missing nodes", () => {
    expect(
      parseFieldMapDocument({
        version: 1,
        nodes: EXAMPLE_FIELD_MAP.nodes,
        edges: [{ id: "e-missing", from: "n1", to: "unknown", label: "enables" }],
      }),
    ).toBeNull();
  });

  it("rejects oversized and malformed imports", () => {
    expect(
      parseFieldMapDocument({
        version: 1,
        nodes: Array.from({ length: 121 }, (_, index) => ({
          id: `n-${index}`,
          type: "goal",
          x: 50,
          y: 50,
          title: "Goal",
          description: "",
        })),
        edges: [],
      }),
    ).toBeNull();
    expect(
      parseFieldMapDocument({
        version: 1,
        nodes: [{ id: "<script>", type: "goal", x: 50, y: 50, title: "Goal", description: "" }],
        edges: [],
      }),
    ).toBeNull();
  });
});
