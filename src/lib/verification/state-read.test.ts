import { beforeEach, describe, expect, it, vi } from "vitest";

const queryRaw = vi.fn();
vi.mock("@/lib/db", () => ({ prisma: { $queryRaw: queryRaw } }));

const { getMemoDrafts } = await import("./state-read");

function sql(): string {
  const strings = queryRaw.mock.calls[0]?.[0] as TemplateStringsArray;
  return strings.join(" ? ").replace(/\s+/g, " ").trim();
}

describe("getMemoDrafts", () => {
  beforeEach(() => {
    queryRaw.mockReset();
    queryRaw.mockResolvedValue([]);
  });

  it("selects the memos store and nothing else in the document", async () => {
    await getMemoDrafts("u1");
    expect(sql()).toContain("\"data\" -> 'memos'");
    expect(sql()).not.toMatch(/notebook|highlights|fieldMap|widgets/);
    expect(sql()).not.toMatch(/SELECT\s+"?data"?\s+FROM/i);
    expect(sql()).not.toMatch(/SELECT\s+\*/i);
  });

  it("passes the user id as a parameter, never as text in the statement", async () => {
    await getMemoDrafts("u1");
    expect(sql()).not.toContain("u1");
    expect(queryRaw.mock.calls[0]?.slice(1)).toEqual(["u1"]);
  });

  it("reads nothing for a learner with no row", async () => {
    expect(await getMemoDrafts("u1")).toEqual([]);
  });

  it("returns null when the table has not been migrated", async () => {
    queryRaw.mockRejectedValue({ code: "42P01" });
    expect(await getMemoDrafts("u1")).toBeNull();
  });

  it("lets any other failure surface", async () => {
    queryRaw.mockRejectedValue(new Error("connection reset"));
    await expect(getMemoDrafts("u1")).rejects.toThrow("connection reset");
  });
});
