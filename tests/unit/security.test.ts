import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("DATA-01/SEC-01/SEC-02 boundaries", () => {
  test("only the ingestion scripts contain SEC fetch logic", () => {
    const client = readFileSync(
      path.resolve("scripts/pipeline/sec-client.ts"),
      "utf8",
    );
    const workspace = readFileSync(
      path.resolve("src/components/comparison/comparison-workspace.tsx"),
      "utf8",
    );
    expect(client).toContain("fetch(");
    expect(workspace).not.toContain("data.sec.gov");
    expect(workspace).not.toContain("SEC_USER_AGENT");
    expect(workspace).not.toContain("dangerouslySetInnerHTML");
  });
});
