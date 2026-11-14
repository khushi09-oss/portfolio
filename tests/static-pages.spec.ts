import { test, expect } from "@playwright/test";

test("shared legacy links arrive at the canonical project URL", async ({
  page,
}) => {
  await page.goto("/#project/tiny-town");
  await expect(page).toHaveURL(/\/project\/tiny-town$/);
  await expect(
    page.getByRole("heading", { name: "Tiny Town", exact: true }),
  ).toBeVisible();
});

test("project pages contain content and unique metadata without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/project/tiny-town/`);
    await expect(
      page.getByRole("heading", { name: "Tiny Town", exact: true }),
    ).toBeVisible();
    await expect(page).toHaveTitle("Tiny Town | Khushi Sahni");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Tiny Town | Khushi Sahni",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/project\/tiny-town$/,
    );
    await page.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Get in touch." }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
