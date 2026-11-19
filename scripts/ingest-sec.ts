import { generateFixtures } from "./pipeline/generate-fixtures";

async function main(): Promise<void> {
  if (!process.argv.includes("--generate")) {
    throw new Error(
      "Use --generate to acknowledge the bounded five-pair ingestion run.",
    );
  }
  if (!process.env.SEC_USER_AGENT) {
    throw new Error(
      "SEC_USER_AGENT is required and must contain a truthful application identity and contact email.",
    );
  }
  const hashes = await generateFixtures();
  process.stdout.write(
    `Generated ${hashes.length} deterministic comparison fixtures.\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Unknown ingestion error"}\n`,
  );
  process.exitCode = 1;
});
