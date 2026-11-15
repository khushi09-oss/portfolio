import { test, expect } from "@playwright/test";

test("scroll brings live illustrations and the project notes into focus without navigating", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  const gallery = page.getByRole("region", { name: "Project gallery" });
  await expect(gallery.locator(".project-emblem svg")).toHaveCount(6);
  const detail = gallery.locator(".gallery-detail");
  await expect(detail).toContainText("Recollia AI Tutor");
  const model = gallery.locator(".atlas-planets");
  const before = await model.evaluate((element) => getComputedStyle(element).rotate);
  await gallery.evaluate((element) => {
    const r = element.getBoundingClientRect();
    const stage = element.querySelector(".gallery-stage")!;
    scrollTo({ top: scrollY + r.top - innerHeight * .14 + (r.height - stage.clientHeight) * .96, behavior: "instant" });
  });
  await expect(detail).toContainText("Tiny Town");
  await expect.poll(() => model.evaluate((element) => getComputedStyle(element).rotate)).not.toBe(before);
  await expect(detail.locator("img")).toHaveAttribute("src", /tiny-town/);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await detail.getByRole("link", { name: /Open Tiny Town/ }).click();
  await expect(page).toHaveURL(/project\/tiny-town\?from=gallery/);
  await page.getByRole("link", { name: "Back to gallery" }).click();
  await expect(detail.getByRole("link", { name: /Open Tiny Town/ })).toBeFocused();
});

test("the project atlas stays readable when JavaScript is unavailable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const cards = page.locator(".gallery-card");
    await expect(cards).toHaveCount(6);
    const positions = await cards.evaluateAll((elements) => elements.map((element) => {
      const r = element.getBoundingClientRect();
      return `${r.x},${r.y}`;
    }));
    expect(new Set(positions).size).toBe(6);
    await cards.filter({ hasText: "Tiny Town" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tiny Town");
  } finally {
    await context.close();
  }
});

test("keyboard selection shows the real preview and reduced motion stays still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "Project gallery" });
  await gallery.getByRole("link", { name: "Galilearn", exact: true }).focus();
  await expect(gallery.locator(".gallery-detail")).toContainText("Galilearn");
  await expect(gallery.locator(".gallery-detail img")).toHaveAttribute("src", /galilearn/);
  const animations = await gallery.evaluate((element) => element.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length);
  expect(animations).toBe(0);
  await gallery.getByRole("link", { name: "Tiny Town", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tiny Town");
});
