export const PARSER_VERSION = "parser-1.0.0";
export const NORMALIZER_VERSION = "normalizer-1.0.0";
export const COMPARISON_VERSION = "align-1.0.0";
export const FIXTURE_VERSION = "v1";
export const MODIFIED_SIMILARITY_THRESHOLD = 0.62;
export const AMBIGUITY_MARGIN = 0.05;
export const MAX_NOTE_LENGTH = 2_000;

export const CHANGE_KINDS = ["added", "removed", "modified"] as const;
export type ChangeKind = (typeof CHANGE_KINDS)[number];
