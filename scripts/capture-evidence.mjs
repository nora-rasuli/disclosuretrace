import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const root = "evidence/screenshots";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function capture(name, viewport, path, interact) {
  const context = await browser.newContext({ viewportSize: viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto(`http://127.0.0.1:3100${path}`, { waitUntil: "networkidle" });
  if (interact) await interact(page);
  await page.screenshot({ path: `${root}/${name}.png`, fullPage: true });
  if (consoleErrors.length)
    throw new Error(`${name}: ${consoleErrors.join(" | ")}`);
  await context.close();
}

await capture("01-index-desktop", { width: 1440, height: 1000 }, "/");
await capture(
  "02-comparison-split-desktop",
  { width: 1440, height: 1200 },
  "/compare/crwd/2024-2025?view=split&types=added,removed,modified",
);
await capture(
  "03-comparison-unified-note",
  { width: 1440, height: 1200 },
  "/compare/crwd/2024-2025?view=unified&types=modified",
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
);
await capture(
  "05-comparison-mobile-320",
  { width: 320, height: 800 },
  "/compare/crwd/2024-2025?view=split&types=added,removed,modified",
);

await browser.close();
process.stdout.write(
  "Captured five browser screenshots with zero console errors.\n",
);
