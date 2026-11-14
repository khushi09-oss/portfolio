import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { projects } from "./data";
import { Introduction } from "./Notebook";

describe("introduction project references", () => {
  it("keeps the Recollia illustration when the project order changes", () => {
    projects.reverse();
    try {
      const html = renderToStaticMarkup(
        createElement(Introduction, { night: false }),
      );
      const slide = html
        .split('class="welcome-state"')[1]
        .split('class="welcome-controls"')[0];
      expect(slide).toContain("Licensed source pages");
      expect(slide).not.toContain("tiny-town-day.png");
    } finally {
      projects.reverse();
    }
  });
  it("can show the introduction before any projects have been added", () => {
    const saved = projects.splice(0);
    try {
      expect(() =>
        renderToStaticMarkup(createElement(Introduction, { night: false })),
      ).not.toThrow();
    } finally {
      projects.push(...saved);
    }
  });
});
