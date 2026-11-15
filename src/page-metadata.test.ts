import { describe, expect, it } from "vitest";
import { parseRoute, projectHref, homeHref } from "./routes";
import { pageMetadata } from "./page-metadata";

describe("public project pages", () => {
  it("uses real paths while accepting previously shared hash links", () => {
    expect(projectHref("tiny-town")).toBe("/project/tiny-town");
    expect(homeHref()).toBe("/");
    for (const href of [
      "#project/tiny-town",
      "/project/tiny-town",
      "/project/tiny-town/",
    ])
      expect(parseRoute(href)).toMatchObject({
        name: "project",
        project: { id: "tiny-town" },
      });
  });
  it("gives each project distinct metadata without tracking return parameters", () => {
    const page = pageMetadata("/project/tiny-town?from=gallery&page=2");
    expect(page.path).toBe("/project/tiny-town");
    expect(page.title).toContain("Tiny Town");
    expect(page.description).toContain("30 residents");
    expect(pageMetadata("/project/recollia").title).not.toBe(page.title);
    expect(pageMetadata("/missing").noindex).toBe(true);
  });
});
