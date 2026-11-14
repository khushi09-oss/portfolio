import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectGallery } from "./ProjectGallery";
import { projects } from "./data";
import { galleryPosition } from "./gallery-layout";

describe("a growing project gallery", () => {
  for (const count of [0, 1, 3, 6, 7, 8, 12, 20]) {
    it(`keeps ${count} projects in readable groups with the correct range`, () => {
      const items = Array.from({ length: count }, (_, i) => ({
        ...projects[0],
        id: `project-${i}`,
        name: `Project ${i + 1}`,
      }));
      const html = renderToStaticMarkup(
        createElement(ProjectGallery, { night: false, items }),
      );
      expect((html.match(/class="gallery-card"/g) ?? []).length).toBe(
        Math.min(count, 6),
      );
      expect(html).not.toContain("KHUSHI’S");
      if (count)
        expect(html).toContain(
          `01—${String(Math.min(count, 6)).padStart(2, "0")} / ${count}`,
        );
      else expect(html).toContain("Projects will appear here.");
      expect(html.includes("Next projects")).toBe(count > 6);
      if (count) expect(html).toContain("project-default-illustration");
    });
  }
  it("uses every available angle and centres incomplete gallery rows", () => {
    for (const count of [1, 2, 3, 4, 5, 6]) {
      const positions = Array.from({ length: count }, (_, i) =>
        galleryPosition(i, count, 700, 600, 1),
      );
      expect(
        new Set(positions.map(({ x, y }) => `${x.toFixed(3)},${y.toFixed(3)}`))
          .size,
      ).toBe(count);
      expect(
        positions.every(({ x, y, tilt }) =>
          [x, y, tilt].every(Number.isFinite),
        ),
      ).toBe(true);
    }
    expect(galleryPosition(3, 4, 700, 600, 0).x).toBe(0);
    expect(galleryPosition(0, 1, 700, 600, 0)).toMatchObject({ x: 0, y: 0 });
  });
});
