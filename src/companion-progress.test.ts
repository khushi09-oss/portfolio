import { describe, expect, it } from "vitest";
import { companionPhase, claimIsSupported } from "./companion-progress";

describe("companion growth", () => {
  it("starts as a seed, becomes a learner after exploration, and a guide after three discoveries", () => {
    expect(companionPhase(0)).toBe(0);
    expect(companionPhase(1)).toBe(1);
    expect(companionPhase(2)).toBe(1);
    expect(companionPhase(3)).toBe(2);
    expect(companionPhase(7)).toBe(2);
  });
});

describe("the final bridge tile", () => {
  it("requires a verified source and the statement supported by the fixture", () => {
    expect(claimIsSupported(false, "combine-ranks")).toBe(false);
    expect(claimIsSupported(true, "all-commits")).toBe(false);
    expect(claimIsSupported(true, "learns-visitors")).toBe(false);
    expect(claimIsSupported(true, "combine-ranks")).toBe(true);
  });
});
