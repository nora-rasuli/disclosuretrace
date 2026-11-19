import { describe, expect, test } from "vitest";
import {
  blockId,
  changeId,
  comparisonId,
  filingId,
  issuerId,
} from "@/domain/ids";

describe("CMP-05 stable identifiers", () => {
  test("uses the frozen identifier scheme deterministically", () => {
    expect(issuerId("1535527")).toBe("issuer:0001535527");
    expect(filingId("0001535527-25-000009")).toBe(
      "filing:0001535527-25-000009",
    );
    expect(blockId("0001535527-25-000009", 7, "Same text")).toMatch(
      /^block:0001535527-25-000009:item-1a:00007:[a-f0-9]{12}$/,
    );
    const comparison = comparisonId("old", "new", "align-1.0.0");
    expect(comparison).toBe("cmp:old:new:item-1a:align-1.0.0");
    expect(changeId(comparison, "added", ["a"])).toBe(
      changeId(comparison, "added", ["a"]),
    );
  });
});
