import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("introduction is optional and opens the project notebook", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Let me show you around.",
  );
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("INTRODUCTION 2 / 3")).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByText("INTRODUCTION 1 / 3")).toBeVisible();
  for (let i = 0; i < 2; i++)
    await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("link", { name: "Open my notebook" }).click();
  await expect(page).toHaveURL(/#work\/recollia$/);
  await expect(
    page.getByRole("group", { name: "Notebook projects" }).getByRole("link"),
  ).toHaveCount(6);
  await page.getByRole("link", { name: "Replay introduction" }).click();
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page.locator(".notebook-spread")).toBeVisible();
});

test("notebook routes survive reload, history and project-page return", async ({
  page,
}) => {
  await page.goto("/#work/tiny-town");
  await expect(
    page.getByRole("link", { name: "Tiny Town", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "GitHub MCP", exact: true }).click();
  await expect(page.locator(".notebook-spread")).toContainText("GitHub MCP");
  await page.goBack();
  await expect(page).toHaveURL(/#work\/tiny-town$/);
  await page.reload();
  await page.getByRole("link", { name: "Open the full project" }).click();
  await expect(page).toHaveURL(/#project\/tiny-town$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tiny Town");
  await page.getByRole("link", { name: "Back to notebook" }).click();
  await expect(
    page.getByRole("link", { name: "Tiny Town", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/#work\/tiny-town$/);
  await page.goto("/#project/not-a-project");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found.",
  );
  await page.getByRole("link", { name: "Open the notebook" }).click();
  await expect(page.locator(".notebook-spread")).toBeVisible();
});

test("direct navigation needs no tour, camera, private assets or 3D", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page.locator(".notebook-spread")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute(
    "href",
    "mailto:work.khushisahni@gmail.com",
  );
  expect(
    requests.filter((url) =>
      /vision\/|hand\.worker|machine-scene|recollia-review|\/input\//.test(url),
    ),
  ).toEqual([]);
});

test("entry, notebook and project pages support keyboard and automated accessibility", async ({
  page,
}) => {
  for (const hash of [
    "#home",
    "#work/recollia",
    "#project/recollia",
    "#about",
    "#contact",
  ]) {
    await page.goto(`/${hash}`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    expect((await new AxeBuilder({ page }).analyze()).violations, hash).toEqual(
      [],
    );
  }
  await page.goto("/#work/galilearn");
  await page.getByRole("link", { name: "Tiny Town", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#work\/tiny-town$/);
  await expect(
    page.getByRole("heading", { name: "Tiny Town", exact: true }),
  ).toBeFocused();
});
