import { test, expect } from "@playwright/test";

test("the source-check task has a clear first-screen entry on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#lab");
  const start = page.getByRole("button", {
    name: "Start source check",
    exact: true,
  });
  await expect(start).toBeInViewport();
  await start.click();
  await expect(page.locator(".source-options")).toBeInViewport();
  await expect(page.locator(".source-options button").first()).toBeFocused();
});

test("a failed lab download keeps navigation and contact usable", async ({
  page,
}) => {
  await page.route(
    /(?:\/assets\/Lab-[^/]+\.js|\/src\/Lab\.tsx)(?:\?.*)?$/,
    (route) => route.abort(),
  );
  await page.goto("/");
  await page.getByRole("link", { name: "Lab", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "The lab couldn't open." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reload page" })).toBeVisible();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Get in touch." }),
  ).toBeVisible();
});

test("a failed hand panel download leaves the source check available", async ({
  page,
}) => {
  await page.route(
    /(?:\/assets\/HandControls-[^/]+\.js|\/src\/HandControls\.tsx)(?:\?.*)?$/,
    (route) => route.abort(),
  );
  await page.goto("/#lab");
  await page
    .getByRole("button", { name: "Hand controls", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hand controls couldn't open." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start source check" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Get in touch." }),
  ).toBeVisible();
});

test("a reloaded project returns to its gallery position and invoking link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#home");
  await page.evaluate(() => scrollTo({ top: 600, behavior: "instant" }));
  const card = page.locator(".gallery-card").filter({ hasText: "Tiny Town" });
  await card.focus();
  await card.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Tiny Town", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("link", { name: "Back to gallery" }).click();
  await expect(card).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
});
