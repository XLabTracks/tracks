import { describe, expect, it } from "vitest";
import {
  buildAssetUrl,
  buildGraphqlUrl,
  buildPostUrl,
  displayHost,
  parseLessWrongId,
  parseLessWrongPostUrl,
} from "./id";

describe("parseLessWrongPostUrl", () => {
  it("accepts post URLs on lesswrong.com and alignmentforum.org", () => {
    expect(
      parseLessWrongPostUrl(
        "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/the-case-for-ensuring",
      ),
    ).toEqual({
      id: "lesswrong__kcKrE9mzEHrdqtDpE",
      site: "lesswrong",
      postId: "kcKrE9mzEHrdqtDpE",
    });
    expect(
      parseLessWrongPostUrl(
        "https://alignmentforum.org/posts/kcKrE9mzEHrdqtDpE/slug-here",
      ),
    )?.toMatchObject({ site: "alignmentforum" });
  });

  it("accepts slug-less and sequence-reader forms", () => {
    expect(
      parseLessWrongPostUrl("https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE"),
    )?.toMatchObject({ postId: "kcKrE9mzEHrdqtDpE" });
    expect(
      parseLessWrongPostUrl(
        "https://www.lesswrong.com/s/aBcDeFg12345/p/kcKrE9mzEHrdqtDpE",
      ),
    )?.toMatchObject({ postId: "kcKrE9mzEHrdqtDpE" });
  });

  it("rejects other hosts and unsafe URLs", () => {
    expect(
      parseLessWrongPostUrl("https://forum.effectivealtruism.org/posts/abc123defg/x"),
    ).toBeNull();
    expect(
      parseLessWrongPostUrl("http://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/x"),
    ).toBeNull();
    expect(
      parseLessWrongPostUrl("https://www.lesswrong.com:8080/posts/kcKrE9mzEHrdqtDpE"),
    ).toBeNull();
    expect(parseLessWrongPostUrl("https://www.lesswrong.com/tag/ai")).toBeNull();
    expect(
      parseLessWrongPostUrl("https://www.lesswrong.com/posts/../../etc"),
    ).toBeNull();
    expect(
      parseLessWrongPostUrl("https://www.lesswrong.com/posts/has-hyphens-x/x"),
    ).toBeNull();
    expect(parseLessWrongPostUrl(null)).toBeNull();
  });
});

describe("parseLessWrongId", () => {
  it("round-trips ids produced by parseLessWrongPostUrl", () => {
    const ref = parseLessWrongPostUrl(
      "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE/x",
    );
    expect(ref).not.toBeNull();
    expect(parseLessWrongId(ref!.id)).toEqual(ref);
  });

  it("rejects malformed ids", () => {
    expect(parseLessWrongId("eaforum__kcKrE9mzEHrdqtDpE")).toBeNull();
    expect(parseLessWrongId("lesswrong__not/safe")).toBeNull();
    expect(parseLessWrongId("lesswrong__")).toBeNull();
    expect(parseLessWrongId("kcKrE9mzEHrdqtDpE")).toBeNull();
    expect(parseLessWrongId(null)).toBeNull();
  });
});

describe("URL builders", () => {
  const ref = parseLessWrongPostUrl(
    "https://lesswrong.com/posts/kcKrE9mzEHrdqtDpE/x",
  )!;

  it("builds canonical reader, GraphQL, and asset URLs", () => {
    expect(buildPostUrl(ref)).toBe(
      "https://www.lesswrong.com/posts/kcKrE9mzEHrdqtDpE",
    );
    expect(buildGraphqlUrl(ref)).toBe("https://www.lesswrong.com/graphql");
    expect(displayHost(ref)).toBe("www.lesswrong.com");
    expect(buildAssetUrl(ref, "images/001-fig 1.png")).toBe(
      "/lesswrong/lesswrong__kcKrE9mzEHrdqtDpE/assets/images/001-fig%201.png",
    );
  });
});
