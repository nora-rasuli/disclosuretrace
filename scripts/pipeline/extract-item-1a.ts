import * as cheerio from "cheerio";
import { blockId, sha256 } from "../../src/domain/ids";
import type { NormalizedBlock, ParsedSection } from "./types";

const ITEM_1A = /^item\s*1a\s*[.\-–—:]?\s*(risk factors?)?/i;
const BOUNDARIES = [
  { regex: /^item\s*1b\b/i, strategy: "item-1b" as const },
  { regex: /^item\s*1c\b/i, strategy: "item-1c" as const },
  { regex: /^item\s*2\b/i, strategy: "item-2" as const },
];

type CandidateBlock = { text: string; kind: NormalizedBlock["kind"] };

export function normalizeMatchText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function displayText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectBlocks(html: string): CandidateBlock[] {
  const $ = cheerio.load(html);
  $("script,style,noscript,template,ix\\:header,ix\\:hidden,[hidden]").remove();
  const blocks: CandidateBlock[] = [];
  $("h1,h2,h3,h4,h5,h6,p,li,tr,div").each((_index, element) => {
    const tag = element.tagName.toLowerCase();
    const node = $(element);
    if (
      tag === "div" &&
      node.children("div,p,ul,ol,table,h1,h2,h3,h4,h5,h6").length > 0
    )
      return;
    if (tag === "tr" && node.children("td,th").length === 0) return;
    if ((tag === "p" || tag === "li") && node.parents("p,li").length > 0)
      return;
    const text = displayText(node.text());
    if (text.length < 2) return;
    const kind: CandidateBlock["kind"] = tag.startsWith("h")
      ? "heading"
      : tag === "li"
        ? "list_item"
        : tag === "tr"
          ? "table_row"
          : "paragraph";
    if (blocks.at(-1)?.text === text) return;
    blocks.push({ text, kind });
  });
  return blocks;
}

export function extractItem1A(html: string, accession: string): ParsedSection {
  const all = collectBlocks(html);
  const candidates = all
    .map((block, index) => ({ block, index }))
    .filter(
      ({ block }) =>
        block.text.length <= 180 &&
        ITEM_1A.test(normalizeMatchText(block.text)),
    );

  let selected:
    | {
        start: number;
        end: number;
        strategy: ParsedSection["boundaryStrategy"];
        heading: string;
      }
    | undefined;
  for (const candidate of candidates) {
    for (const boundary of BOUNDARIES) {
      const endOffset = all
        .slice(candidate.index + 1)
        .findIndex(
          (block) =>
            block.text.length <= 180 &&
            boundary.regex.test(normalizeMatchText(block.text)),
        );
      if (endOffset < 0) continue;
      const end = candidate.index + 1 + endOffset;
      const characters = all
        .slice(candidate.index + 1, end)
        .reduce((sum, block) => sum + block.text.length, 0);
      if (characters >= 5_000 && end - candidate.index >= 10) {
        selected = {
          start: candidate.index,
          end,
          strategy: boundary.strategy,
          heading: candidate.block.text,
        };
        break;
      }
    }
    if (selected) break;
  }
  if (!selected)
    throw new Error(`Unable to validate Item 1A boundaries for ${accession}`);

  const raw = all.slice(selected.start + 1, selected.end);
  const shortFrequency = new Map<string, number>();
  for (const block of raw) {
    if (block.text.length <= 80)
      shortFrequency.set(block.text, (shortFrequency.get(block.text) ?? 0) + 1);
  }
  const removedBlocks: ParsedSection["removedBlocks"] = [];
  const cleaned = raw.filter((block) => {
    if (/^\d{1,3}$/.test(block.text)) {
      removedBlocks.push({ reason: "page_number", text: block.text });
      return false;
    }
    if (
      (shortFrequency.get(block.text) ?? 0) >= 4 &&
      ITEM_1A.test(block.text)
    ) {
      removedBlocks.push({
        reason: "repeated_running_header",
        text: block.text,
      });
      return false;
    }
    return true;
  });

  let currentHeading: string[] = [];
  const blocks = cleaned.map((block, index): NormalizedBlock => {
    const headingLike =
      block.kind === "heading" ||
      (block.text.length <= 180 && /[.:]$/.test(block.text));
    if (headingLike) currentHeading = [block.text];
    const ordinal = index + 1;
    return {
      id: blockId(accession, ordinal, block.text),
      ordinal,
      kind: block.kind,
      displayText: block.text,
      matchText: normalizeMatchText(block.text),
      headingPath: currentHeading,
      displaySha256: sha256(block.text),
      normalizationFlags: [],
    };
  });
  const totalCharacters = blocks.reduce(
    (sum, block) => sum + block.displayText.length,
    0,
  );
  if (blocks.length < 10 || totalCharacters < 5_000) {
    throw new Error(
      `Extracted Item 1A failed minimum validation for ${accession}`,
    );
  }
  return {
    accession,
    sourceHeading: selected.heading,
    boundaryStrategy: selected.strategy,
    blocks,
    textSha256: sha256(blocks.map((block) => block.displayText).join("\n")),
    validationMessages: [
      "toc_candidate_rejected",
      `boundary:${selected.strategy}`,
    ],
    removedBlocks,
  };
}
