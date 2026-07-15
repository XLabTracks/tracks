import { describe, expect, it } from "vitest";
import {
  buildApiUrl,
  buildAssetUrl,
  buildPostUrl,
  parseSubstackId,
  parseSubstackPostUrl,
} from "./id";

describe("parseSubstackPostUrl", () => {
  it("accepts public post URLs on substack.com and custom domains", () => {
    expect(
      parseSubstackPostUrl("https://example.substack.com/p/some-post"),
    ).toEqual({
      id: "example.substack.com__some-post",
      host: "example.substack.com",
      slug: "some-post",
    });
    expect(
      parseSubstackPostUrl("https://blog.redwoodresearch.org/p/ai-futurism-reading-list"),
    ).toEqual({
      id: "blog.redwoodresearch.org__ai-futurism-reading-list",
      host: "blog.redwoodresearch.org",
      slug: "ai-futurism-reading-list",
    });
  });

  it("tolerates query strings, fragments, and a trailing slash", () => {
    expect(
      parseSubstackPostUrl("https://example.substack.com/p/some-post/"),
    )?.toMatchObject({ slug: "some-post" });
    expect(
      parseSubstackPostUrl(
        "https://example.substack.com/p/some-post?utm_source=x#footnote-1",
      ),
    )?.toMatchObject({ slug: "some-post" });
  });

  it("rejects non-post paths", () => {
    expect(parseSubstackPostUrl("https://example.substack.com/")).toBeNull();
    expect(parseSubstackPostUrl("https://example.substack.com/about")).toBeNull();
    expect(
      parseSubstackPostUrl("https://example.substack.com/p/a/b"),
    ).toBeNull();
  });

  it("rejects injection-shaped and unsafe URLs", () => {
    expect(parseSubstackPostUrl("http://example.substack.com/p/x")).toBeNull();
    expect(parseSubstackPostUrl("https://localhost/p/x")).toBeNull();
    expect(parseSubstackPostUrl("https://127.0.0.1/p/x")).toBeNull();
    expect(parseSubstackPostUrl("https://example.com:8080/p/x")).toBeNull();
    expect(parseSubstackPostUrl("https://user@example.com/p/x")).toBeNull();
    expect(parseSubstackPostUrl("https://example.com/p/UPPER")).toBeNull();
    expect(parseSubstackPostUrl("https://example.com/p/a_b")).toBeNull();
    expect(parseSubstackPostUrl("https://example.com/p/..")).toBeNull();
    expect(parseSubstackPostUrl("not a url")).toBeNull();
    expect(parseSubstackPostUrl("")).toBeNull();
    expect(parseSubstackPostUrl(null)).toBeNull();
  });
});

describe("parseSubstackId", () => {
  it("round-trips ids produced by parseSubstackPostUrl", () => {
    const ref = parseSubstackPostUrl("https://example.substack.com/p/some-post");
    expect(ref).not.toBeNull();
    expect(parseSubstackId(ref!.id)).toEqual(ref);
  });

  it("rejects malformed ids", () => {
    expect(parseSubstackId("no-separator")).toBeNull();
    expect(parseSubstackId("host__slug__extra")).toBeNull();
    expect(parseSubstackId("single-label__slug")).toBeNull();
    expect(parseSubstackId("1.2.3.4__slug")).toBeNull();
    expect(parseSubstackId("example.com__../etc")).toBeNull();
    expect(parseSubstackId(null)).toBeNull();
  });
});

describe("URL builders", () => {
  const ref = parseSubstackPostUrl("https://example.substack.com/p/some-post")!;

  it("builds reader and API URLs", () => {
    expect(buildPostUrl(ref)).toBe("https://example.substack.com/p/some-post");
    expect(buildApiUrl(ref)).toBe(
      "https://example.substack.com/api/v1/posts/some-post",
    );
  });

  it("builds site-relative asset URLs with encoded segments", () => {
    expect(buildAssetUrl(ref, "images/001-fig 1.png")).toBe(
      "/substack/example.substack.com__some-post/assets/images/001-fig%201.png",
    );
  });
});
