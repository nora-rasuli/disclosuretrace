import { z } from "zod";

export const FilingSchema = z.object({
  id: z.string().startsWith("filing:"),
  issuerId: z.string().startsWith("issuer:"),
  accession: z.string().regex(/^\d{10}-\d{2}-\d{6}$/),
  form: z.literal("10-K"),
  periodEnd: z.iso.date(),
  filedAt: z.iso.date(),
  primaryDocument: z.string().min(1),
  sourceUrl: z.url().startsWith("https://www.sec.gov/Archives/edgar/"),
  indexUrl: z.url().startsWith("https://www.sec.gov/Archives/edgar/"),
  retrievedAt: z.iso.datetime(),
  sha256: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .nullable(),
  hashStatus: z.enum(["verified_raw_source", "pending_authorized_ingestion"]),
  bytes: z.number().int().positive().nullable(),
  isAmendment: z.literal(false),
  status: z.enum(["validated", "partial", "unavailable"]),
});

export type Filing = z.infer<typeof FilingSchema>;

export const SourceReferenceSchema = z.object({
  id: z.string().startsWith("src:"),
  filingId: z.string().startsWith("filing:"),
  blockIds: z.array(z.string().startsWith("block:")).min(1),
  accession: z.string(),
  sourceUrl: z.url().startsWith("https://www.sec.gov/Archives/edgar/"),
  indexUrl: z.url().startsWith("https://www.sec.gov/Archives/edgar/"),
  locatorLabel: z.literal("Item 1A — Risk Factors"),
  excerptSha256: z.string().regex(/^[a-f0-9]{64}$/),
});

export type SourceReference = z.infer<typeof SourceReferenceSchema>;
