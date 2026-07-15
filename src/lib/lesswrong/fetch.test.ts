import { describe, expect, it } from "vitest";
import { classifyPostResponse } from "./fetch";
import { parseLessWrongPostUrl } from "./id";

const ref = parseLessWrongPostUrl(
  "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/x",
)!;

const baseResult = {
  _id: "kcKrE9mzEHrdqtDpE",
  title: "Some Post",
  slug: "some-post",
  postedAt: "2024-01-24T16:11:51.407Z",
  draft: null,
  user: { displayName: "ryan_greenblatt" },
  coauthors: [{ displayName: "Buck" }],
  contents: { html: "<p>Hello.</p>" },
};

const wrap = (result: unknown) => ({ data: { post: { result } } });

describe("classifyPostResponse", () => {
  it("extracts the converter subset from a public post", () => {
    expect(classifyPostResponse(ref, wrap(baseResult))).toEqual({
      kind: "post",
      post: {
        title: "Some Post",
        authors: ["ryan_greenblatt", "Buck"],
        postedAt: "2024-01-24T16:11:51.407Z",
        canonicalUrl:
          "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/some-post",
        bodyHtml: "<p>Hello.</p>",
      },
    });
  });

  it("treats null results and drafts as not-found", () => {
    expect(classifyPostResponse(ref, wrap(null)).kind).toBe("not-found");
    expect(classifyPostResponse(ref, { data: { post: null } }).kind).toBe(
      "not-found",
    );
    expect(
      classifyPostResponse(ref, wrap({ ...baseResult, draft: true })).kind,
    ).toBe("not-found");
  });

  it("never trusts a result that echoes a different id", () => {
    // Observed in the wild: the API answering an unknown id with another post.
    expect(
      classifyPostResponse(ref, wrap({ ...baseResult, _id: "differentPost1" }))
        .kind,
    ).toBe("not-found");
  });

  it("classifies posts without an html body as empty (terminal)", () => {
    expect(
      classifyPostResponse(ref, wrap({ ...baseResult, contents: null })).kind,
    ).toBe("empty");
    expect(
      classifyPostResponse(ref, wrap({ ...baseResult, contents: { html: "" } }))
        .kind,
    ).toBe("empty");
  });

  it("tolerates missing optional fields", () => {
    const result = classifyPostResponse(
      ref,
      wrap({ _id: ref.postId, title: "T", contents: { html: "<p>x</p>" } }),
    );
    expect(result.kind).toBe("post");
    if (result.kind !== "post") return;
    expect(result.post.authors).toEqual([]);
    expect(result.post.canonicalUrl).toBe(
      "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE",
    );
  });

  it("flags shapeless responses as transient", () => {
    expect(classifyPostResponse(ref, null).kind).toBe("transient-error");
    expect(
      classifyPostResponse(ref, wrap({ ...baseResult, title: "" })).kind,
    ).toBe("transient-error");
  });
});
