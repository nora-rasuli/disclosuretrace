import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { CatalogSchema } from "@/contracts/catalog";
import { ComparisonSchema } from "@/contracts/comparison";

describe("P-02/P-03/P-05/SH-01 generated fixtures", () => {
  const catalog = CatalogSchema.parse(
    JSON.parse(
      readFileSync(path.resolve("data/generated/v1/catalog.json"), "utf8"),
    ),
  );

  test("contains exactly the frozen five pairs", () => {
    expect(catalog.items.map((item) => `${item.ticker}:${item.pair}`)).toEqual([
      "CRWD:2024-2025",
      "ABNB:2024-2025",
      "COST:2025-2026",
      "DAL:2024-2025",
      "F:2024-2025",
    ]);
  });

  test("SH-01 counts are exact invariants and every change resolves to official source context", () => {
    for (const item of catalog.items) {
      const fixture = ComparisonSchema.parse(
        JSON.parse(
          readFileSync(
            path.resolve(
              `data/generated/v1/comparisons/${item.ticker.toLowerCase()}-${item.pair}.json`,
            ),
            "utf8",
          ),
        ),
      );
      expect(fixture.counts.total).toBe(fixture.changes.length);
      expect(fixture.counts.added).toBe(
        fixture.changes.filter((change) => change.kind === "added").length,
      );
      expect(fixture.counts.removed).toBe(
        fixture.changes.filter((change) => change.kind === "removed").length,
      );
      expect(fixture.counts.modified).toBe(
        fixture.changes.filter((change) => change.kind === "modified").length,
      );
      for (const change of fixture.changes) {
        for (const passage of [change.oldPassage, change.newPassage].filter(
          Boolean,
        )) {
          expect(passage?.source.sourceUrl).toMatch(
            /^https:\/\/www\.sec\.gov\/Archives\/edgar\//,
          );
        }
      }
    }
  });
});
