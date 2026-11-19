import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { ComparisonSchema } from "@/contracts/comparison";
import { noteExportFilename, serializeNotes } from "@/domain/notes-export";
import {
  loadNotes,
  noteStorageKey,
  validateNote,
  type NoteMap,
} from "@/domain/notes-storage";

const comparison = ComparisonSchema.parse(
  JSON.parse(
    readFileSync(
      path.resolve("data/generated/v1/comparisons/crwd-2024-2025.json"),
      "utf8",
    ),
  ),
);

describe("P-11/NOTE-01/SH-02 browser-local notes", () => {
  test("validates trimming and the 2,000 character boundary", () => {
    expect(validateNote("   ")).toMatch(/Enter a note/);
    expect(validateNote("a".repeat(2_001))).toMatch(/2,000/);
    expect(validateNote("Check the filing context")).toBeNull();
  });

  test("rejects invalid restored storage without throwing", () => {
    expect(loadNotes({ getItem: () => "not-json" }, comparison.id)).toEqual({});
    expect(noteStorageKey(comparison.id)).toContain(
      "disclosuretrace:notes:v1:",
    );
  });

  test("SH-02 exports user-authored notes, provenance, and no filing passage text", () => {
    const change = comparison.changes[0]!;
    const notes: NoteMap = {
      [change.id]: {
        changeId: change.id,
        comparisonId: comparison.id,
        body: "Check this wording elsewhere in the filing.",
        createdAt: "2026-11-17T10:00:00.000Z",
        updatedAt: "2026-11-17T10:00:00.000Z",
        schemaVersion: 1,
        storage: "local",
      },
    };
    const markdown = serializeNotes(comparison, notes);
    expect(markdown).toContain("User-authored research notes");
    expect(markdown).toContain(change.id);
    expect(markdown).toContain(comparison.olderFiling.sourceUrl);
    expect(markdown).not.toContain(
      change.newPassage?.displayText ?? "impossible",
    );
    expect(
      noteExportFilename(comparison, new Date("2026-11-17T00:00:00Z")),
    ).toBe("disclosuretrace-crwd-2024-2025-notes-2026-11-17.md");
  });
});
