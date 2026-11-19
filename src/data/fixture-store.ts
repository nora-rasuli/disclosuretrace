import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CatalogSchema, type Catalog } from "@/contracts/catalog";
import { ComparisonSchema, type Comparison } from "@/contracts/comparison";

const GENERATED_DIR = path.resolve("data/generated/v1");

export async function loadCatalog(): Promise<Catalog> {
  const raw = await readFile(path.join(GENERATED_DIR, "catalog.json"), "utf8");
  return CatalogSchema.parse(JSON.parse(raw));
}

export async function loadComparison(id: string): Promise<Comparison | null> {
  const catalog = await loadCatalog();
  const item = catalog.items.find((candidate) => candidate.comparisonId === id);
  if (!item) return null;
  const filename = `${item.ticker.toLowerCase()}-${item.pair}.json`;
  const raw = await readFile(
    path.join(GENERATED_DIR, "comparisons", filename),
    "utf8",
  );
  return ComparisonSchema.parse(JSON.parse(raw));
}

export async function comparisonForRoute(ticker: string, pair: string) {
  const catalog = await loadCatalog();
  return catalog.items.find(
    (item) =>
      item.ticker.toLowerCase() === ticker.toLowerCase() && item.pair === pair,
  );
}
