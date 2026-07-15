import { describe, expect, it } from "vitest";
import { classifyPostJson } from "./fetch";

const basePost = {
  title: "Some Post",
  subtitle: "A subtitle",
  audience: "everyone",
  post_date: "2026-07-02T18:38:41.178Z",
  canonical_url: "https://example.substack.com/p/some-post",
  body_html: "<p>Hello.</p>",
  publishedBylines: [{ name: "Ada Author" }, { name: "Ben Byline" }],
};

describe("classifyPostJson", () => {
  it("extracts the converter subset from a public post", () => {
    const result = classifyPostJson(basePost);
    expect(result).toEqual({
      kind: "post",
      post: {
        title: "Some Post",
        subtitle: "A subtitle",
        authors: ["Ada Author", "Ben Byline"],
        postDate: "2026-07-02T18:38:41.178Z",
        canonicalUrl: "https://example.substack.com/p/some-post",
        bodyHtml: "<p>Hello.</p>",
      },
    });
  });

  it("treats any non-public audience as paywalled", () => {
    expect(classifyPostJson({ ...basePost, audience: "only_paid" }).kind).toBe(
      "paywalled",
    );
    expect(classifyPostJson({ ...basePost, audience: "founding" }).kind).toBe(
      "paywalled",
    );
    expect(classifyPostJson({ ...basePost, audience: undefined }).kind).toBe(
      "paywalled",
    );
  });

  it("treats a missing or empty body as paywalled", () => {
    expect(classifyPostJson({ ...basePost, body_html: undefined }).kind).toBe(
      "paywalled",
    );
    expect(classifyPostJson({ ...basePost, body_html: "" }).kind).toBe(
      "paywalled",
    );
  });

  it("tolerates missing optional fields", () => {
    const result = classifyPostJson({
      title: "T",
      audience: "everyone",
      body_html: "<p>x</p>",
    });
    expect(result.kind).toBe("post");
    if (result.kind !== "post") return;
    expect(result.post.authors).toEqual([]);
    expect(result.post.subtitle).toBeUndefined();
    expect(result.post.canonicalUrl).toBeUndefined();
  });

  it("flags shapeless responses as transient", () => {
    expect(classifyPostJson(null).kind).toBe("transient-error");
    expect(classifyPostJson("nope").kind).toBe("transient-error");
    expect(
      classifyPostJson({ audience: "everyone", body_html: "<p>x</p>" }).kind,
    ).toBe("transient-error"); // no title
  });
});
