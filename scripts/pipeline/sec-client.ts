import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { sha256 } from "../../src/domain/ids";

const CACHE_DIR = path.resolve(".cache/sec");
const MIN_INTERVAL_MS = 500;
let lastRequestAt = 0;

export type FetchRecord = {
  body: string;
  retrievedAt: string;
  bytes: number;
  sha256: string;
  etag?: string;
  lastModified?: string;
  contentType?: string;
  cacheHit: boolean;
};

function cachePath(key: string): string {
  return path.join(CACHE_DIR, `${key.replace(/[^a-zA-Z0-9._-]/g, "_")}.body`);
}

function metadataPath(key: string): string {
  return `${cachePath(key)}.json`;
}

async function waitForRateLimit(): Promise<void> {
  const remaining = MIN_INTERVAL_MS - (Date.now() - lastRequestAt);
  if (remaining > 0)
    await new Promise((resolve) => setTimeout(resolve, remaining));
  lastRequestAt = Date.now();
}

export async function fetchSec(
  url: string,
  key: string,
  force = false,
): Promise<FetchRecord> {
  if (
    !url.startsWith("https://www.sec.gov/") &&
    !url.startsWith("https://data.sec.gov/")
  ) {
    throw new Error(`SEC URL is not allowlisted: ${url}`);
  }
  await mkdir(CACHE_DIR, { recursive: true });
  const bodyPath = cachePath(key);
  const metaPath = metadataPath(key);
  if (!force) {
    try {
      const [body, metadata] = await Promise.all([
        readFile(bodyPath, "utf8"),
        readFile(metaPath, "utf8").then(
          (value) => JSON.parse(value) as Omit<FetchRecord, "body">,
        ),
      ]);
      return { ...metadata, body, cacheHit: true };
    } catch {
      // Cache miss is expected on the first authorized ingestion.
    }
  }

  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent || !userAgent.includes("@")) {
    throw new Error(
      "SEC_USER_AGENT must contain a descriptive identity and contact email",
    );
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await waitForRateLimit();
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
          Accept: "text/html,application/json",
        },
        signal: AbortSignal.timeout(30_000),
      });
      if (response.status === 429 || response.status >= 500) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        const backoff =
          retryAfter > 0
            ? retryAfter * 1_000
            : 500 * 2 ** (attempt - 1) + attempt * 73;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(backoff, 10_000)),
        );
        throw new Error(`SEC returned ${response.status}`);
      }
      if (!response.ok) throw new Error(`SEC returned ${response.status}`);
      const body = await response.text();
      const etag = response.headers.get("etag");
      const lastModified = response.headers.get("last-modified");
      const contentType = response.headers.get("content-type");
      const record: Omit<FetchRecord, "body"> = {
        retrievedAt: new Date().toISOString(),
        bytes: Buffer.byteLength(body),
        sha256: sha256(body),
        ...(etag ? { etag } : {}),
        ...(lastModified ? { lastModified } : {}),
        ...(contentType ? { contentType } : {}),
        cacheHit: false,
      };
      const temporary = `${bodyPath}.tmp`;
      await writeFile(temporary, body);
      try {
        const existing = await readFile(bodyPath, "utf8");
        if (sha256(existing) !== record.sha256) {
          throw new Error(
            `Source hash mismatch for ${key}; existing cache was not overwritten`,
          );
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("hash mismatch"))
          throw error;
        await rename(temporary, bodyPath);
      }
      try {
        await stat(temporary);
        await rename(temporary, `${temporary}.${record.sha256.slice(0, 8)}`);
      } catch {
        // Temporary file was promoted to the cache.
      }
      await writeFile(metaPath, `${JSON.stringify(record, null, 2)}\n`);
      return { ...record, body };
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("SEC retrieval failed");
}
