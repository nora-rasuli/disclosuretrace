import type { Comparison } from "@/contracts/comparison";
import { PRODUCT_SLUG } from "@/config/product";
import type { NoteMap } from "./notes-storage";

function indentLiteral(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => `    ${line}`)
    .join("\n");
}

export function serializeNotes(comparison: Comparison, notes: NoteMap): string {
  const selected = comparison.changes
    .map((change) => ({ change, note: notes[change.id] }))
    .filter(
      (
        entry,
      ): entry is {
        change: Comparison["changes"][number];
        note: NonNullable<typeof entry.note>;
      } => Boolean(entry.note),
    );
  const lines = [
    `# User-authored research notes — ${comparison.issuer.ticker} ${comparison.olderFiling.periodEnd}–${comparison.newerFiling.periodEnd}`,
    "",
    "> These notes were authored by the user and stored in their browser. Filing text is intentionally excluded.",
    "",
    `- Issuer: ${comparison.issuer.legalName} (${comparison.issuer.ticker})`,
    `- Comparison: ${comparison.id}`,
    `- Section: ${comparison.sectionTitle}`,
    `- Prior filing: ${comparison.olderFiling.accession} — ${comparison.olderFiling.sourceUrl}`,
    `- Current filing: ${comparison.newerFiling.accession} — ${comparison.newerFiling.sourceUrl}`,
    "",
  ];
  for (const { change, note } of selected) {
    lines.push(
      `## ${change.ordinal}. ${change.kind[0]!.toUpperCase()}${change.kind.slice(1)} wording`,
      "",
      `- Change ID: ${change.id}`,
      `- Saved: ${note.updatedAt}`,
      `- Prior SEC source: ${change.oldPassage?.source.sourceUrl ?? "Not applicable"}`,
      `- Current SEC source: ${change.newPassage?.source.sourceUrl ?? "Not applicable"}`,
      "",
      "User-authored note:",
      "",
      indentLiteral(note.body),
      "",
    );
  }
  return `${lines.join("\n").trim()}\n`;
}

export function noteExportFilename(
  comparison: Comparison,
  date = new Date(),
): string {
  const day = date.toISOString().slice(0, 10);
  return `${PRODUCT_SLUG}-${comparison.issuer.ticker.toLowerCase()}-${comparison.olderFiling.periodEnd.slice(0, 4)}-${comparison.newerFiling.periodEnd.slice(0, 4)}-notes-${day}.md`
    .replace(/[^a-z0-9._-]/gi, "-")
    .replace(/-+/g, "-");
}

export function downloadNotes(comparison: Comparison, notes: NoteMap): void {
  const blob = new Blob([serializeNotes(comparison, notes)], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = noteExportFilename(comparison);
  anchor.click();
  queueMicrotask(() => URL.revokeObjectURL(url));
}
