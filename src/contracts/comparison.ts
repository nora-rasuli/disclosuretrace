import { z } from "zod";
import { CHANGE_KINDS } from "@/config/comparison";
import { FilingSchema, SourceReferenceSchema } from "./filing";

export const WordSpanSchema = z.object({
  kind: z.enum(["equal", "added", "removed"]),
  text: z.string(),
});

export const PassageSchema = z.object({
  blockId: z.string().startsWith("block:"),
  displayText: z.string().min(1),
  headingPath: z.array(z.string()),
  source: SourceReferenceSchema,
});

export const ChangeSchema = z.object({
  id: z.string().startsWith("chg:"),
  comparisonId: z.string().startsWith("cmp:"),
  kind: z.enum(CHANGE_KINDS),
  ordinal: z.number().int().positive(),
  oldPassage: PassageSchema.nullable(),
  newPassage: PassageSchema.nullable(),
  oldContext: z.object({
    before: PassageSchema.nullable(),
    after: PassageSchema.nullable(),
  }),
  newContext: z.object({
    before: PassageSchema.nullable(),
    after: PassageSchema.nullable(),
  }),
  oldWordSpans: z.array(WordSpanSchema),
  newWordSpans: z.array(WordSpanSchema),
  alignmentReason: z.enum([
    "light_edit",
    "unmatched_prior",
    "unmatched_current",
  ]),
  similarity: z.number().min(0).max(1).nullable(),
  orderChanged: z.boolean(),
});

const IssuerSchema = z.object({
  id: z.string().startsWith("issuer:"),
  cik: z.string().regex(/^\d{10}$/),
  ticker: z.string().min(1),
  legalName: z.string().min(1),
  displayName: z.string().min(1),
});

export const ComparisonSchema = z.object({
  id: z.string().startsWith("cmp:"),
  route: z.string().startsWith("/compare/"),
  fixtureVersion: z.literal("v1"),
  algorithmVersion: z.string(),
  generatedAt: z.iso.datetime(),
  status: z.enum(["complete", "partial"]),
  issuer: IssuerSchema,
  sectionCode: z.literal("item-1a"),
  sectionTitle: z.literal("Item 1A — Risk Factors"),
  olderFiling: FilingSchema,
  newerFiling: FilingSchema,
  counts: z.object({
    total: z.number().int().nonnegative(),
    added: z.number().int().nonnegative(),
    removed: z.number().int().nonnegative(),
    modified: z.number().int().nonnegative(),
  }),
  changes: z.array(ChangeSchema),
  exclusions: z.array(
    z.object({ code: z.string(), count: z.number().int(), reason: z.string() }),
  ),
  method: z.object({
    parserVersion: z.string(),
    normalizerVersion: z.string(),
    comparisonVersion: z.string(),
  }),
});

export type Comparison = z.infer<typeof ComparisonSchema>;
export type Change = z.infer<typeof ChangeSchema>;
export type Passage = z.infer<typeof PassageSchema>;
export type WordSpan = z.infer<typeof WordSpanSchema>;
