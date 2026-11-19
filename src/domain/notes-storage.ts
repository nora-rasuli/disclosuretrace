import { z } from "zod";
import { MAX_NOTE_LENGTH } from "@/config/comparison";
import { PRODUCT_SLUG } from "@/config/product";

export const ResearchNoteSchema = z.object({
  changeId: z.string().startsWith("chg:"),
  comparisonId: z.string().startsWith("cmp:"),
  body: z.string().trim().min(1).max(MAX_NOTE_LENGTH),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  schemaVersion: z.literal(1),
  storage: z.literal("local"),
});

export type ResearchNote = z.infer<typeof ResearchNoteSchema>;
export type NoteMap = Record<string, ResearchNote>;

export function noteStorageKey(comparisonId: string): string {
  return `${PRODUCT_SLUG}:notes:v1:${comparisonId}`;
}

export function loadNotes(
  storage: Pick<Storage, "getItem">,
  comparisonId: string,
): NoteMap {
  const raw = storage.getItem(noteStorageKey(comparisonId));
  if (!raw) return {};
  try {
    const parsed = z.array(ResearchNoteSchema).safeParse(JSON.parse(raw));
    if (!parsed.success) return {};
    return Object.fromEntries(parsed.data.map((note) => [note.changeId, note]));
  } catch {
    return {};
  }
}

export function persistNotes(
  storage: Pick<Storage, "setItem">,
  comparisonId: string,
  notes: NoteMap,
): void {
  storage.setItem(
    noteStorageKey(comparisonId),
    JSON.stringify(
      Object.values(notes).sort((a, b) => a.changeId.localeCompare(b.changeId)),
    ),
  );
}

export function validateNote(body: string): string | null {
  const trimmed = body.trim();
  if (!trimmed) return "Enter a note before saving.";
  if (trimmed.length > MAX_NOTE_LENGTH)
    return `Notes are limited to ${MAX_NOTE_LENGTH.toLocaleString()} characters.`;
  return null;
}
