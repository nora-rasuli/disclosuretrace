import { describe, expect, test } from "vitest";
import {
  extractItem1A,
  normalizeMatchText,
} from "../../scripts/pipeline/extract-item-1a";

const longParagraph =
  "This filing passage describes a bounded textual risk factor and preserves its source wording for review. ".repeat(
    70,
  );

describe("DATA-04/DATA-05 section-aware extraction", () => {
  test("rejects a short TOC candidate and extracts the credible Item 1A section", () => {
    const html = `<html><body>
      <table><tr><td>Item 1A.</td><td>Risk Factors</td></tr><tr><td>Item 1B.</td></tr></table>
      <h2>ITEM 1A. RISK FACTORS</h2>
      ${Array.from({ length: 12 }, (_, index) => `<p>${longParagraph} ${index}</p>`).join("")}
      <h2>ITEM 1B. UNRESOLVED STAFF COMMENTS</h2>
    </body></html>`;
    const section = extractItem1A(html, "0001535527-25-000009");
    expect(section.blocks.length).toBeGreaterThanOrEqual(10);
    expect(section.boundaryStrategy).toBe("item-1b");
    expect(section.validationMessages).toContain("toc_candidate_rejected");
  });

  test("fails closed when a credible next-item boundary is absent", () => {
    expect(() =>
      extractItem1A(
        `<h2>Item 1A. Risk Factors</h2><p>${longParagraph}</p>`,
        "missing",
      ),
    ).toThrow(/Unable to validate/);
  });

  test("normalizes heading punctuation without changing display input", () => {
    expect(normalizeMatchText("Item 1A—Risk Factors")).toBe(
      "Item 1A-Risk Factors",
    );
  });

  test.each([
    ["ITEM 1C. CYBERSECURITY", "item-1c"],
    ["ITEM 2. PROPERTIES", "item-2"],
  ])("uses the %s next-item fallback", (nextHeading, strategy) => {
    const html = `<h2>ITEM 1A: RISK FACTORS</h2>
      ${Array.from({ length: 12 }, (_, index) => `<div><p>${longParagraph} ${index}</p></div>`).join("")}
      <h2>${nextHeading}</h2>`;
    expect(extractItem1A(html, `boundary-${strategy}`).boundaryStrategy).toBe(
      strategy,
    );
  });

  test("handles Inline XBRL, layout tables, page numbers, and repeated running headers", () => {
    const body = Array.from(
      { length: 12 },
      (_, index) =>
        `<table><tr><td>${longParagraph} ${index}</td></tr></table>${index < 4 ? "<p>Item 1A. Risk Factors</p>" : ""}<p>${index + 1}</p>`,
    ).join("");
    const html = `<html><body><ix:hidden>hidden XBRL metadata</ix:hidden><h2>Item 1A. Risk Factors</h2>${body}<h2>Item 1B. Unresolved Staff Comments</h2></body></html>`;
    const section = extractItem1A(html, "inline-table");
    expect(section.blocks.some((block) => block.kind === "table_row")).toBe(
      true,
    );
    expect(section.removedBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reason: "page_number" }),
        expect.objectContaining({ reason: "repeated_running_header" }),
      ]),
    );
    expect(
      section.blocks.map((block) => block.displayText).join(" "),
    ).not.toContain("hidden XBRL metadata");
  });

  test("fails closed for a renamed or reference-only heading", () => {
    const html = `<h2>Risk Considerations</h2>${Array.from({ length: 12 }, () => `<p>${longParagraph}</p>`).join("")}<h2>Item 1B.</h2>`;
    expect(() => extractItem1A(html, "renamed")).toThrow(/Unable to validate/);
  });
});
