import { describe, expect, it } from "vitest";
import { previewHeight } from "./private-preview";

describe("private preview messages", () => {
  it("accepts a finite height from the preview protocol", () => {
    expect(
      previewHeight({ type: "portfolio-preview:height", height: 1400 }),
    ).toBe(1400);
  });
  it("rejects other messages and invalid document heights", () => {
    for (const value of [
      null,
      {},
      { type: "other", height: 1400 },
      ...[-1, 0, Infinity, NaN, 20001, "1400"].map((height) => ({
        type: "portfolio-preview:height",
        height,
      })),
    ])
      expect(previewHeight(value)).toBeNull();
  });
});
