import { describe, expect, it } from "vitest";

import { explainsOddCloudObservable } from "./cloud-evidence-drill";

describe("cloud evidence response checks", () => {
  it("accepts a principle that distinguishes actor evidence from activity metrics", () => {
    expect(
      explainsOddCloudObservable(
        "The ownership record identifies the actor, whereas the other three measure compute activity."
      )
    ).toBe(true);
  });

  it("does not accept a response that names only the selected item", () => {
    expect(
      explainsOddCloudObservable(
        "The beneficial-ownership record identifies the customer."
      )
    ).toBe(false);
  });

  it("does not accept a response that discusses only technical metrics", () => {
    expect(
      explainsOddCloudObservable(
        "The other three are technical metrics of compute usage."
      )
    ).toBe(false);
  });
});
