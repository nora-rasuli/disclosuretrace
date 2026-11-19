import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ComparisonSchema } from "@/contracts/comparison";

const mocks = vi.hoisted(() => ({ loadLiveComparison: vi.fn() }));

vi.mock("@/server/sec-live", () => {
  class LiveSecError extends Error {
    constructor(
      message: string,
      public readonly code: string,
    ) {
      super(message);
    }
  }
  return { LiveSecError, loadLiveComparison: mocks.loadLiveComparison };
});

import { GET } from "@/app/api/v1/live-comparisons/[ticker]/route";

const comparison = ComparisonSchema.parse(
  JSON.parse(
    readFileSync(
      path.resolve("data/generated/v1/comparisons/crwd-2024-2025.json"),
      "utf8",
    ),
  ),
);

describe("live SEC comparison route", () => {
  beforeEach(() => mocks.loadLiveComparison.mockReset());

  test("returns a typed comparison with live cache policy", async () => {
    mocks.loadLiveComparison.mockResolvedValue({
      ...comparison,
      fixtureVersion: "live",
    });
    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ ticker: "crwd" }),
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600");
    expect((await response.json()).fixtureVersion).toBe("live");
  });
});
