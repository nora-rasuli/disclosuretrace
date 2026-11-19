import { expect, test } from "@playwright/test";

const canonical =
  "/compare/crwd/2024-2025?view=split&types=added,removed,modified";

test("P-01 guided path, URL restoration, note reload, and SH-02 export", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /See what changed/ }),
  ).toBeVisible();
  await expect(page.getByText(/self-directed concept project/)).toBeVisible();
  await page.getByRole("link", { name: /Compare CrowdStrike/ }).click();
  await expect(page).toHaveURL(/\/compare\/crwd\/2024-2025/);
  await expect(
    page.getByRole("heading", { name: /what changed in Risk Factors/ }),
  ).toBeVisible();
  await expect(page.getByText("∑ Total")).toBeVisible();
  await expect(
    page.getByText("Only manually verified source passages are shown."),
  ).toBeVisible();

  await page.getByRole("checkbox", { name: "+ Added" }).click();
  await expect(
    page.getByRole("checkbox", { name: "+ Added" }),
  ).not.toBeChecked();
  await page.getByRole("checkbox", { name: "− Removed" }).click();
  await expect(
    page.getByRole("checkbox", { name: "− Removed" }),
  ).not.toBeChecked();
  await expect(page).toHaveURL(/types=modified/);
  await expect(page.getByText("~ Wording modified")).toBeVisible();

  await page.getByRole("button", { name: "← Previous" }).focus();
  await page.keyboard.press("Alt+ArrowDown");
  await expect(page).toHaveURL(/change=chg%3A/);
  await expect(page.locator("#active-change-heading")).toBeFocused();

  await page
    .getByLabel(/Note for change/)
    .fill("Check this wording against the service-disruption discussion");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByText("Saved in this browser.")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download notes as Markdown" })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(
    /^disclosuretrace-crwd-2024-2025-notes-\d{4}-\d{2}-\d{2}\.md$/,
  );

  await page.reload();
  await expect(page.getByLabel(/Note for change/)).toHaveValue(
    "Check this wording against the service-disruption discussion",
  );
  await expect(page).toHaveURL(/view=split/);
  await expect(page).toHaveURL(/types=modified/);
});

test("UX-03 API 503 recovery preserves route state", async ({ page }) => {
  let shouldFail = true;
  await page.route("**/api/v1/comparisons/**", async (route) => {
    if (shouldFail)
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "unavailable" } }),
      });
    else await route.continue();
  });
  await page.goto(canonical);
  await page.getByRole("button", { name: "Refresh local fixture" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Refresh unavailable" }),
  ).toContainText("could not be refreshed");
  shouldFail = false;
  await page.getByRole("button", { name: "Retry comparison" }).click();
  await expect(
    page.getByRole("heading", { name: /what changed in Risk Factors/ }),
  ).toBeVisible();
  await expect(page).toHaveURL(
    /types=added%2Cremoved%2Cmodified|types=added,removed,modified/,
  );
});

test("UX-06/A11Y-01/A11Y-06 320px reflow completes the note workflow without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(canonical);
  await expect(
    page.getByRole("region", { name: "Prior filing passage" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Current filing passage" }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "Next →" }).click();
  await expect(page).toHaveURL(/change=chg%3A/);
  await page.getByLabel(/Note for change/).fill("Mobile keyboard review note");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByText("Saved in this browser.")).toBeVisible();
});

test("P-08/QA-06 exposes only allowlisted official SEC source URLs", async ({
  request,
}) => {
  const catalogResponse = await request.get("/api/v1/catalog");
  expect(catalogResponse.ok()).toBeTruthy();
  const catalog = (await catalogResponse.json()) as {
    items: Array<{ comparisonId: string }>;
  };
  expect(catalog.items).toHaveLength(5);
  for (const item of catalog.items) {
    const response = await request.get(
      `/api/v1/comparisons/${encodeURIComponent(item.comparisonId)}`,
    );
    expect(response.ok()).toBeTruthy();
    const fixture = (await response.json()) as {
      olderFiling: { sourceUrl: string };
      newerFiling: { sourceUrl: string };
    };
    for (const url of [
      fixture.olderFiling.sourceUrl,
      fixture.newerFiling.sourceUrl,
    ]) {
      expect(url).toMatch(/^https:\/\/www\.sec\.gov\/Archives\/edgar\//);
    }
  }
});
