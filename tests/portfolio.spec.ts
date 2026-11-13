import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("portfolio content, contact links, and accessible project dialog", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI products",
  );
  await page.getByRole("button", { name: /01.*PRODUCTION.*Recollia/s }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("heading", { level: 2 }),
  ).toHaveText("Recollia AI Tutor");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByText("Grounded answers", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Say hello/ })).toHaveAttribute(
    "href",
    "mailto:work.khushisahni@gmail.com",
  );
  await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/khushi-sahni",
  );
  expect(errors).toEqual([]);
});

test("lab checks provenance, teaches the companion, and exposes decision history", async ({
  page,
}) => {
  await page.goto("/#lab");
  await page.getByRole("button", { name: /Try a co-op task/ }).click();
  await page.getByRole("button", { name: /retrieval.py f9e8d7c/ }).click();
  await expect(page.getByRole("status")).toContainText("wrong revision");
  await page.getByRole("button", { name: /notes.md a1b2c3d/ }).click();
  await expect(page.getByRole("status")).toContainText("not retrieved");
  await page.getByRole("button", { name: /retrieval.py a1b2c3d/ }).click();
  await expect(page.getByRole("status")).toContainText("Evidence connected");
  await expect(
    page.getByText("Source finding, learned. We make a good team."),
  ).toBeVisible();
  await expect(
    page.getByText("Evidence checking", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /The decision/ }).click();
  await expect(
    page.getByRole("heading", { name: "Pin the evidence to one commit." }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Back to portfolio/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI products",
  );
});

test("theme persists and both routes pass automated accessibility checks", async ({
  page,
}) => {
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Switch to night mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: "Lab", exact: false }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Follow the evidence",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`portfolio and lab fit ${width}px with reduced motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.goto("/#lab");
    await page
      .getByRole("button", { name: "Hand controls", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Hand controls" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}

test("camera assets are lazy, a declined permission is recoverable", async ({
  page,
}) => {
  const cameraAssets: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/vision/")) cameraAssets.push(request.url());
  });
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Declined in test", "NotAllowedError");
    };
  });
  await page.goto("/#lab");
  await page
    .getByRole("button", { name: "Hand controls", exact: true })
    .click();
  await expect(page.getByText("Camera off", { exact: true })).toBeVisible();
  expect(cameraAssets).toEqual([]);
  await page
    .getByRole("button", { name: "Enable camera", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "permission was declined",
  );
  await page.getByRole("button", { name: /Answer$/ }).click();
  await expect(page.getByRole("button", { name: /Answer$/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(cameraAssets).toEqual([]);
});

test("real hand model initializes on synthetic camera and tracks stop on close", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices,
    );
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      const stream = await original(constraints);
      (window as unknown as { testStream: MediaStream }).testStream = stream;
      return stream;
    };
  });
  await page.goto("/#lab");
  await page
    .getByRole("button", { name: "Hand controls", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Enable camera", exact: true })
    .click();
  await expect(page.getByText("Camera on", { exact: true })).toBeVisible({
    timeout: 45000,
  });
  await page.getByRole("button", { name: "Close hand controls" }).click();
  expect(
    await page.evaluate(() =>
      (window as unknown as { testStream: MediaStream }).testStream
        .getTracks()
        .every((t) => t.readyState === "ended"),
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Hand controls", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Enable camera", exact: true })
    .click();
  await expect(page.getByText("Camera on", { exact: true })).toBeVisible({
    timeout: 45000,
  });
  await page.getByRole("link", { name: /Back to portfolio/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI products",
  );
  expect(
    await page.evaluate(() =>
      (window as unknown as { testStream: MediaStream }).testStream
        .getTracks()
        .every((track) => track.readyState === "ended"),
    ),
  ).toBe(true);
});

test("a camera permission that resolves after cancellation cannot keep tracks alive", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices,
    );
    navigator.mediaDevices.getUserMedia = (constraints) =>
      new Promise((resolve) => {
        (
          window as unknown as { resolveCamera: () => Promise<void> }
        ).resolveCamera = async () => {
          const stream = await original(constraints);
          (window as unknown as { testStream: MediaStream }).testStream =
            stream;
          resolve(stream);
        };
      });
  });
  await page.goto("/#lab");
  await page
    .getByRole("button", { name: "Hand controls", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Enable camera", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancel camera" }).click();
  await page.evaluate(() =>
    (
      window as unknown as { resolveCamera: () => Promise<void> }
    ).resolveCamera(),
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { testStream: MediaStream }).testStream
          .getTracks()
          .every((track) => track.readyState === "ended"),
      ),
    )
    .toBe(true);
  await expect(page.getByText("Camera off", { exact: true })).toBeVisible();
});
