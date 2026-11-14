import { describe, expect, it } from "vitest";
import { checkSource, pinchPosition, type Landmark } from "./evidence";

describe("evidence challenge", () => {
  it("accepts only a retrieved source pinned to the selected commit", () => {
    expect(checkSource("retrieval.py", "a1b2c3d")).toBe(true);
    expect(checkSource("retrieval.py", "different")).toBe(false);
    expect(checkSource("invented.py", "a1b2c3d")).toBe(false);
    expect(checkSource("", "")).toBe(false);
  });
});

describe("pinch input", () => {
  const hand = (): Landmark[] =>
    Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5 }));
  it("requires a real hand-sized reference instead of accepting a collapsed detection", () => {
    expect(pinchPosition(hand())).toBeNull();
    expect(pinchPosition([])).toBeNull();
  });
  it("normalizes pinch distance to hand size and mirrors the camera position", () => {
    const points = hand();
    points[0] = { x: 0.25, y: 0.8 };
    points[9] = { x: 0.25, y: 0.4 };
    points[4] = { x: 0.2, y: 0.3 };
    points[8] = { x: 0.22, y: 0.3 };
    expect(pinchPosition(points)).toBeCloseTo(0.79);
    points[8] = { x: 0.6, y: 0.3 };
    expect(pinchPosition(points)).toBeNull();
  });
  it("rejects non-finite and out-of-frame landmarks", () => {
    const points = hand();
    points[9] = { x: 0.4, y: 0.8 };
    points[4] = { x: Number.NaN, y: 0.3 };
    expect(pinchPosition(points)).toBeNull();
    points[4] = { x: 4, y: 0.3 };
    expect(pinchPosition(points)).toBeNull();
  });
});
