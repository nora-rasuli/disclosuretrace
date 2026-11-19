import { readFile } from "node:fs/promises";
import path from "node:path";
import { sha256 } from "../src/domain/ids";

async function main(): Promise<void> {
  const directory = path.resolve("data/generated/v1");
  const manifest = JSON.parse(
    await readFile(path.join(directory, "version-manifest.json"), "utf8"),
  ) as {
    fixtureHashes: string[];
  };
  const catalog = JSON.parse(
    await readFile(path.join(directory, "catalog.json"), "utf8"),
  ) as {
    items: Array<{ ticker: string; pair: string }>;
  };
  const hashes = [];
  for (const item of catalog.items) {
    const filename = `${item.ticker.toLowerCase()}-${item.pair}.json`;
    const raw = await readFile(
      path.join(directory, "comparisons", filename),
      "utf8",
    );
    hashes.push(sha256(raw));
  }
  if (JSON.stringify(hashes) !== JSON.stringify(manifest.fixtureHashes)) {
    throw new Error(
      "Committed comparison fixture hashes do not match the version manifest",
    );
  }
  process.stdout.write(
    `Deterministic: ${hashes.length} committed comparison hashes match the version manifest.\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Determinism check failed"}\n`,
  );
  process.exitCode = 1;
});
