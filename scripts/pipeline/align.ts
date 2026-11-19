import { diffWordsWithSpace } from "diff";
import {
  AMBIGUITY_MARGIN,
  COMPARISON_VERSION,
  MODIFIED_SIMILARITY_THRESHOLD,
} from "../../src/config/comparison";
import type {
  Change,
  Comparison,
  Passage,
  WordSpan,
} from "../../src/contracts/comparison";
import type { Filing, SourceReference } from "../../src/contracts/filing";
import { changeId, comparisonId, sha256, sourceId } from "../../src/domain/ids";
import type { CorpusPair, NormalizedBlock, ParsedSection } from "./types";

function tokens(value: string): Set<string> {
  return new Set(value.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
}

export function tokenSetSimilarity(left: string, right: string): number {
  const a = tokens(left);
  const b = tokens(right);
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return (2 * intersection) / (a.size + b.size);
}

function spans(
  oldText: string,
  newText: string,
): { oldWordSpans: WordSpan[]; newWordSpans: WordSpan[] } {
  const changes = diffWordsWithSpace(oldText, newText);
  const oldWordSpans: WordSpan[] = [];
  const newWordSpans: WordSpan[] = [];
  for (const part of changes) {
    if (part.added) newWordSpans.push({ kind: "added", text: part.value });
    else if (part.removed)
      oldWordSpans.push({ kind: "removed", text: part.value });
    else {
      oldWordSpans.push({ kind: "equal", text: part.value });
      newWordSpans.push({ kind: "equal", text: part.value });
    }
  }
  return { oldWordSpans, newWordSpans };
}

function passage(block: NormalizedBlock, filing: Filing): Passage {
  const blockIds = [block.id];
  const source: SourceReference = {
    id: sourceId(filing.id, blockIds),
    filingId: filing.id,
    blockIds,
    accession: filing.accession,
    sourceUrl: filing.sourceUrl,
    indexUrl: filing.indexUrl,
    locatorLabel: "Item 1A — Risk Factors",
    excerptSha256: sha256(block.displayText),
  };
  return {
    blockId: block.id,
    displayText: block.displayText,
    headingPath: block.headingPath,
    source,
  };
}

function context(
  section: ParsedSection,
  block: NormalizedBlock,
  filing: Filing,
) {
  const index = section.blocks.findIndex(
    (candidate) => candidate.id === block.id,
  );
  return {
    before: index > 0 ? passage(section.blocks[index - 1]!, filing) : null,
    after:
      index >= 0 && index < section.blocks.length - 1
        ? passage(section.blocks[index + 1]!, filing)
        : null,
  };
}

type Paired = {
  oldBlock: NormalizedBlock;
  newBlock: NormalizedBlock;
  similarity: number;
};

export function buildComparison(
  pair: CorpusPair,
  olderSection: ParsedSection,
  newerSection: ParsedSection,
  olderFiling: Filing,
  newerFiling: Filing,
  generatedAt: string,
  dataVersion: Comparison["fixtureVersion"] = "v1",
): Comparison {
  const id = comparisonId(
    olderFiling.accession,
    newerFiling.accession,
    COMPARISON_VERSION,
  );
  const oldByHash = new Map<string, NormalizedBlock[]>();
  for (const block of olderSection.blocks) {
    const values = oldByHash.get(block.displaySha256) ?? [];
    values.push(block);
    oldByHash.set(block.displaySha256, values);
  }
  const matchedOld = new Set<string>();
  const matchedNew = new Set<string>();
  for (const current of newerSection.blocks) {
    const exact = oldByHash
      .get(current.displaySha256)
      ?.find((candidate) => !matchedOld.has(candidate.id));
    if (exact) {
      matchedOld.add(exact.id);
      matchedNew.add(current.id);
    }
  }

  const remainingOld = olderSection.blocks.filter(
    (block) => !matchedOld.has(block.id),
  );
  const remainingNew = newerSection.blocks.filter(
    (block) => !matchedNew.has(block.id),
  );
  const pairs: Paired[] = [];
  for (const current of remainingNew) {
    const candidates = remainingOld
      .filter((candidate) => !matchedOld.has(candidate.id))
      .map((candidate) => ({
        oldBlock: candidate,
        newBlock: current,
        similarity: tokenSetSimilarity(candidate.matchText, current.matchText),
      }))
      .sort(
        (a, b) =>
          b.similarity - a.similarity ||
          a.oldBlock.ordinal - b.oldBlock.ordinal,
      );
    const best = candidates[0];
    const runnerUp = candidates[1];
    if (
      best &&
      best.similarity >= MODIFIED_SIMILARITY_THRESHOLD &&
      (!runnerUp || best.similarity - runnerUp.similarity >= AMBIGUITY_MARGIN)
    ) {
      pairs.push(best);
      matchedOld.add(best.oldBlock.id);
      matchedNew.add(best.newBlock.id);
    }
  }

  const drafts: Array<Omit<Change, "ordinal"> & { sort: number }> = [];
  for (const pairMatch of pairs) {
    const blockIds = [pairMatch.oldBlock.id, pairMatch.newBlock.id];
    drafts.push({
      id: changeId(id, "modified", blockIds),
      comparisonId: id,
      kind: "modified",
      oldPassage: passage(pairMatch.oldBlock, olderFiling),
      newPassage: passage(pairMatch.newBlock, newerFiling),
      oldContext: context(olderSection, pairMatch.oldBlock, olderFiling),
      newContext: context(newerSection, pairMatch.newBlock, newerFiling),
      ...spans(pairMatch.oldBlock.displayText, pairMatch.newBlock.displayText),
      alignmentReason: "light_edit",
      similarity: Number(pairMatch.similarity.toFixed(6)),
      orderChanged: pairMatch.oldBlock.ordinal !== pairMatch.newBlock.ordinal,
      sort: pairMatch.newBlock.ordinal,
    });
  }
  for (const block of remainingOld.filter(
    (candidate) => !matchedOld.has(candidate.id),
  )) {
    drafts.push({
      id: changeId(id, "removed", [block.id]),
      comparisonId: id,
      kind: "removed",
      oldPassage: passage(block, olderFiling),
      newPassage: null,
      oldContext: context(olderSection, block, olderFiling),
      newContext: { before: null, after: null },
      oldWordSpans: [{ kind: "removed", text: block.displayText }],
      newWordSpans: [],
      alignmentReason: "unmatched_prior",
      similarity: null,
      orderChanged: false,
      sort: block.ordinal + 0.25,
    });
  }
  for (const block of remainingNew.filter(
    (candidate) => !matchedNew.has(candidate.id),
  )) {
    drafts.push({
      id: changeId(id, "added", [block.id]),
      comparisonId: id,
      kind: "added",
      oldPassage: null,
      newPassage: passage(block, newerFiling),
      oldContext: { before: null, after: null },
      newContext: context(newerSection, block, newerFiling),
      oldWordSpans: [],
      newWordSpans: [{ kind: "added", text: block.displayText }],
      alignmentReason: "unmatched_current",
      similarity: null,
      orderChanged: false,
      sort: block.ordinal,
    });
  }
  const changes: Change[] = drafts
    .sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id))
    .map(({ sort, ...change }, index) => {
      void sort;
      return { ...change, ordinal: index + 1 };
    });
  const counts = {
    total: changes.length,
    added: changes.filter((change) => change.kind === "added").length,
    removed: changes.filter((change) => change.kind === "removed").length,
    modified: changes.filter((change) => change.kind === "modified").length,
  };
  return {
    id,
    route: `/compare/${pair.ticker.toLowerCase()}/${pair.pair}`,
    fixtureVersion: dataVersion,
    algorithmVersion: COMPARISON_VERSION,
    generatedAt,
    status: "complete",
    issuer: {
      id: pair.cik.startsWith("issuer:") ? pair.cik : `issuer:${pair.cik}`,
      cik: pair.cik,
      ticker: pair.ticker,
      legalName: pair.legalName,
      displayName: pair.displayName,
    },
    sectionCode: "item-1a",
    sectionTitle: "Item 1A — Risk Factors",
    olderFiling,
    newerFiling,
    counts,
    changes,
    exclusions: [],
    method: {
      parserVersion: "parser-1.0.0",
      normalizerVersion: "normalizer-1.0.0",
      comparisonVersion: COMPARISON_VERSION,
    },
  };
}
