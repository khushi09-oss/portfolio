import { test, expect } from "@playwright/test";

test("phone lab controls keep readable labels and comfortable targets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lab");
  const hands = page.getByRole("button", {
    name: "Hand controls",
    exact: true,
  });
  await expect(hands).toHaveCSS("font-size", "12px");
  const controls = page.locator(".machine-controls button");
  await expect(controls).toHaveCount(4);
  expect(
    await controls.evaluateAll((buttons) =>
      buttons.every(
        (button) =>
          button.getBoundingClientRect().height >= 44 &&
          parseFloat(getComputedStyle(button).fontSize) >= 12,
      ),
    ),
  ).toBe(true);
});

for (const denied of [false, true]) {
  test(`contact exposes the email and handles ${denied ? "denied" : "successful"} copying`, async ({
    page,
  }) => {
    await page.addInitScript((denied) => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async (text: string) => {
            if (denied)
              throw new DOMException("Unavailable", "NotAllowedError");
            (window as unknown as { copiedEmail: string }).copiedEmail = text;
          },
        },
      });
    }, denied);
    await page.goto("/contact");
    await expect(
      page.getByRole("link", {
        name: "work.khushisahni@gmail.com",
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Copy email", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText(
      denied ? "Select the address above to copy it." : "Email copied.",
    );
    if (!denied)
      expect(
        await page.evaluate(
          () => (window as unknown as { copiedEmail: string }).copiedEmail,
        ),
      ).toBe("work.khushisahni@gmail.com");
  });
}
