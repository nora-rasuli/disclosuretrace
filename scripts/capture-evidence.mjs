import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const root = "evidence/screenshots";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true });
const capturedAt = new Date().toISOString();
const records = [];

async function capture(
  name,
  viewport,
  path,
  state,
  interact,
  mockedOrIntercepted = false,
) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto(`http://127.0.0.1:3100${path}`, { waitUntil: "networkidle" });
  if (interact) await interact(page);
  await page.screenshot({ path: `${root}/${name}.png`, fullPage: true });
  const renderedViewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  records.push({
    filename: `${name}.png`,
    route: path,
    requestedViewport: viewport,
    renderedViewport,
    zoom: "100%",
    browser: `Chromium ${browser.version()}`,
    capturedAt,
    commit: process.env.EVIDENCE_COMMIT ?? "working-tree",
    deployment: "local production build",
    fixtureVersion: "v1",
    state,
    mockedOrIntercepted,
    consoleErrorCount: consoleErrors.length,
    expectedConsoleErrors: mockedOrIntercepted ? consoleErrors : [],
  });
  if (consoleErrors.length && !mockedOrIntercepted)
    throw new Error(`${name}: ${consoleErrors.join(" | ")}`);
  await context.close();
}

await capture(
  "01-index-desktop",
  { width: 1440, height: 1000 },
  "/",
  "five-pair partial catalog",
);
await capture(
  "02-comparison-split-desktop",
  { width: 1440, height: 1200 },
  "/compare/crwd/2024-2025?view=split&types=added,removed,modified",
  "partial comparison, split view",
);
await capture(
  "03-comparison-unified-note",
  { width: 1440, height: 1200 },
  "/compare/crwd/2024-2025?view=unified&types=modified",
  "partial comparison, unified view, saved local note",
  async (page) => {
    await page
      .getByLabel(/Note for change/)
      .fill("Evidence-only local research note");
    await page.getByRole("button", { name: "Save note" }).click();
    await page.getByText("Saved in this browser.").waitFor();
  },
);
await capture(
  "04-comparison-mobile-390",
  { width: 390, height: 844 },
  "/compare/crwd/2024-2025?view=split&types=added,removed,modified",
  "partial comparison, stacked mobile split view",
);
await capture(
  "05-comparison-mobile-320",
  { width: 320, height: 800 },
  "/compare/crwd/2024-2025?view=split&types=added,removed,modified",
  "partial comparison, 320px reflow",
);
await capture(
  "06-comparison-refresh-error",
  { width: 1440, height: 900 },
  "/compare/crwd/2024-2025?view=split&types=modified",
  "intercepted comparison API 503 with retained fixture and retry",
  async (page) => {
    await page.route("**/api/v1/comparisons/**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "audit_unavailable" } }),
      }),
    );
    await page.getByRole("button", { name: "Refresh local fixture" }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "Refresh unavailable" })
      .waitFor();
  },
  true,
);

await browser.close();
await writeFile(
  `${root}/metadata.json`,
  `${JSON.stringify({ capturedAt, records }, null, 2)}\n`,
);
process.stdout.write(
  "Captured six browser screenshots with viewport metadata and no unexpected console errors.\n",
);
