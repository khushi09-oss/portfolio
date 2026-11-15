import { describe, expect, it } from "vitest";
import { parseRoute, projectHref } from "./routes";

describe("portfolio routes", () => {
  it("keeps old links and represents gallery origins and pages", () => {
    expect(parseRoute("")).toMatchObject({ name: "home", page: 0 });
    expect(parseRoute("#home?page=3")).toMatchObject({ name: "home", page: 2 });
    expect(parseRoute("#work/tiny-town")).toMatchObject({
      name: "work",
      project: { id: "tiny-town" },
    });
    expect(parseRoute(projectHref("tiny-town", { page: 2 }))).toMatchObject({
      name: "project",
      fromGallery: true,
      page: 2,
      project: { id: "tiny-town" },
    });
  });
  it("keeps lab origins internal and rejects unknown destinations", () => {
    expect(parseRoute("#lab?from=github-mcp")).toMatchObject({
      name: "lab",
      fromProject: "github-mcp",
    });
    expect(parseRoute("#lab?from=https://example.com")).toMatchObject({
      name: "lab",
      fromProject: undefined,
    });
    for (const hash of [
      "#project/missing",
      "#project/recollia/other",
      "#contact/extra",
      "#home//extra",
    ])
      expect(parseRoute(hash).name).toBe("not-found");
    for (const value of [
      "-1",
      "NaN",
      "Infinity",
      "1.5",
      "999999999999999999999999999",
    ])
      expect(parseRoute(`#home?page=${value}`)).toMatchObject({
        name: "home",
        page: 0,
      });
  });
});
