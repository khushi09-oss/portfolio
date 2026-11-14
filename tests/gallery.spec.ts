import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("gallery gathers and rotates on scroll while project links stay usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "Project gallery" });
  await expect(gallery.getByRole("link")).toHaveCount(6);
  const first = gallery.getByRole("link").first();
  const paper = first.locator(".gallery-card-paper");
  const beforeHover = await paper.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await first.hover();
  await expect
    .poll(() =>
      paper.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(beforeHover);
  await page.mouse.move(10, 10);
  const before = await first.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.evaluate(() => scrollTo(0, innerHeight * 0.75));
  await expect
    .poll(() =>
      first.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(before);
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#project\/recollia$/);
});

test("reduced motion keeps a static gallery and dark surfaces use charcoal", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "Project gallery" });
  const first = gallery.getByRole("link").first();
  const before = await first.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.evaluate(() => scrollTo(0, innerHeight * 0.75));
  await expect(first).toHaveCSS("transform", before);
  await first.hover();
  await expect(first.locator(".gallery-card-paper")).toHaveCSS(
    "transform",
    "none",
  );
  await page.getByRole("button", { name: "Switch to night mode" }).click();
  const surface = await page
    .locator("html")
    .evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--surface").trim(),
    );
  expect(surface).toBe("#2c292f");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("touch-sized gallery fits a phone and does not require hover", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "Project gallery" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const link = gallery.getByRole("link", { name: "Tiny Town", exact: true });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tiny Town");
});
