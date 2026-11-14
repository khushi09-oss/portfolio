import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("project previews show real interfaces and Tiny Town follows the selected theme", async ({
  page,
}) => {
  await page.goto("/#work/tiny-town");
  const town = page.getByRole("img", { name: /Tiny Town's pixel village/ });
  await expect(town).toBeVisible();
  await expect
    .poll(() =>
      town.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBe(1440);
  await page.getByRole("button", { name: "Switch to night mode" }).click();
  await expect(town).toHaveAttribute("src", "/projects/tiny-town-night.png");
  await page.getByRole("link", { name: "Open the full project" }).click();
  await expect(
    page.getByRole("img", { name: /Tiny Town's pixel village/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to notebook" }).click();
  await page.getByRole("link", { name: "Galilearn", exact: true }).click();
  const galilearn = page.getByRole("img", {
    name: /Galilearn's coded design prototype/,
  });
  await expect(galilearn).toBeVisible();
  await expect
    .poll(() =>
      galilearn.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBe(1440);
});

test("portfolio content, contact links, and shareable project page", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Let me show",
  );
  await page.getByRole("link", { name: "Skip introduction" }).click();
  await page.getByRole("link", { name: "Open the full project" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Recollia AI Tutor",
  );
  await expect(page.locator(".project-page-role")).toContainText(
    "October 2026",
  );
  await page.getByRole("link", { name: "Back to notebook" }).click();
  await expect(page.locator(".notebook-spread")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute(
    "href",
    "mailto:work.khushisahni@gmail.com",
  );
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
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
    page.getByRole("figure", { name: "Co-op evidence bridge" }),
  ).toHaveAttribute("data-tiles", "2");
  await page
    .getByRole("button", {
      name: "The retriever searches every commit in GitHub.",
    })
    .click();
  await expect(page.getByRole("status")).toContainText("not supported");
  await expect(
    page.getByRole("figure", { name: "Co-op evidence bridge" }),
  ).toHaveAttribute("data-tiles", "2");
  await page
    .getByRole("button", {
      name: "The retriever combines two ranked result lists.",
    })
    .click();
  await expect(
    page.getByRole("figure", { name: "Co-op evidence bridge" }),
  ).toHaveAttribute("data-tiles", "3");
  await expect(
    page.getByText(
      "Source and claim checked. You can explore GitHub MCP next.",
    ),
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
    "A closer look",
  );
});

test("companion grows from exploration without counting the same project twice", async ({
  page,
}) => {
  await page.goto("/#about");
  const current = page.locator('.growth-stop[aria-current="step"]');
  await expect(current).toContainText("The seed");
  for (const id of ["recollia", "recollia"]) {
    await page.evaluate((id) => {
      location.hash = `project/${id}`;
    }, id);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About", exact: true })
      .click();
  }
  await expect(current).toContainText("The learner");
  await expect(page.locator(".companion-level")).toContainText("01");
  for (const id of ["github-mcp", "kiranaledger"]) {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Work", exact: true })
      .click();
    await page
      .getByRole("link", {
        name: id === "github-mcp" ? "GitHub MCP" : "KiranaLedger",
        exact: true,
      })
      .click();
    await page.getByRole("link", { name: "Open the full project" }).click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About", exact: true })
      .click();
  }
  await expect(current).toContainText("The guide");
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
    "Try a source check",
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
    for (const route of ["work/recollia", "project/galilearn"]) {
      await page.goto(`/#${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
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
    "A closer look",
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
