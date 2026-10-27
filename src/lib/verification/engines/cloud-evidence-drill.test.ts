import { describe, expect, it } from "vitest";

import {
  answeredOddCloudObservable,
  explainsOddCloudObservable,
} from "./cloud-evidence-drill";

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

describe("the wrong-answer message can tell the two failures apart", () => {
  it("does not call a filled-in answer blank", () => {
    expect(
      answeredOddCloudObservable(
        "owner",
        "The ownership record says who controls the account; the rest are numbers about how busy it was.",
      ),
    ).toBe(true);
  });

  it("still reports a missing half as missing", () => {
    expect(answeredOddCloudObservable(null, "A long enough sentence about it.")).toBe(false);
    expect(answeredOddCloudObservable("owner", "too short")).toBe(false);
  });
});

describe("plain wordings a reader would actually write", () => {
  it.each([
    "The ownership record identifies who controls the account, while the other three measure how much it was used.",
    "Beneficial ownership says who the customer is; the rest are measurements of account activity.",
    "The owner record is about a person, not about usage like the other three.",
    "Three of them measure resource use. The ownership record identifies the entity behind the account instead.",
  ])("accepts %s", (text) => {
    expect(explainsOddCloudObservable(text)).toBe(true);
  });

  it("still refuses a sentence that names only one side", () => {
    expect(
      explainsOddCloudObservable("The beneficial-ownership record identifies the customer."),
    ).toBe(false);
    expect(
      explainsOddCloudObservable("The other three are technical metrics of compute usage."),
    ).toBe(false);
  });
});
