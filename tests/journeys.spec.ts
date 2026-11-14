import { test, expect } from "@playwright/test";

test("a gallery visitor returns to the same scene and focused project", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.evaluate(() => scrollTo(0, 650));
  const card = page
    .getByRole("region", { name: "Project gallery" })
    .getByRole("link", { name: "Tiny Town", exact: true });
  await card.click();
  await expect(page).toHaveURL(/#project\/tiny-town\?from=gallery/);
  await page.goBack();
  await expect(card).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
  await card.click();
  await page.getByRole("link", { name: "Back to gallery" }).click();
  await expect(card).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
  await page.locator(".wordmark").click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test("a project connects its explanation, interactive example and next project", async ({
  page,
}) => {
  await page.goto("/#work/github-mcp");
  await expect(page.locator(".notebook-left")).toContainText("My contribution");
  await page.getByRole("link", { name: "Open the full project" }).click();
  await page
    .getByRole("link", { name: "Try a source check", exact: true })
    .click();
  await expect(page).toHaveURL(/#lab\?from=github-mcp$/);
  await page.getByRole("link", { name: "Back to GitHub MCP" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "GitHub MCP",
  );
  await page.getByRole("link", { name: /Next project.*KiranaLedger/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "KiranaLedger",
  );
  await expect(
    page.getByRole("link", { name: "Discuss this project" }),
  ).toHaveAttribute("href", /subject=About%20KiranaLedger/);
});

test("the first action opens the work and notebook selection focuses the new spread", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore my work", exact: true })
    .click();
  await page.getByRole("link", { name: "Tiny Town", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tiny Town", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".notebook-left")).toContainText("mock decisions");
  await expect(
    page.getByRole("link", { name: "Open live demo" }),
  ).toHaveAttribute("href", "https://khushi09-oss.github.io/jev-town/");
});

test("the lab keeps a gallery-origin project on the same return path", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#home");
  await page.evaluate(() => scrollTo(0, 650));
  const card = page
    .getByRole("region", { name: "Project gallery" })
    .getByRole("link", { name: "GitHub MCP", exact: true });
  await card.click();
  await page
    .getByRole("link", { name: "Try a source check", exact: true })
    .click();
  await expect(page).toHaveURL(/#lab\?from=github-mcp&gallery=1&page=1$/);
  await page.getByRole("link", { name: "Back to GitHub MCP" }).click();
  await page.getByRole("link", { name: "Back to gallery" }).click();
  await expect(card).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
});
