"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CHANGE_KINDS,
  MAX_NOTE_LENGTH,
  type ChangeKind,
} from "@/config/comparison";
import { DISCLAIMER } from "@/config/product";
import {
  ComparisonSchema,
  type Change,
  type Comparison,
  type Passage,
  type WordSpan,
} from "@/contracts/comparison";
import { downloadNotes } from "@/domain/notes-export";
import {
  loadNotes,
  persistNotes,
  validateNote,
  type NoteMap,
  type ResearchNote,
} from "@/domain/notes-storage";
import { ApiError } from "@/app/providers";

type ViewMode = "split" | "unified";

async function fetchComparison(id: string): Promise<Comparison> {
  const response = await fetch(`/api/v1/comparisons/${encodeURIComponent(id)}`);
  if (!response.ok)
    throw new ApiError(
      response.status === 429
        ? "The comparison is temporarily rate limited."
        : "The comparison could not be loaded.",
      response.status,
    );
  return ComparisonSchema.parse(await response.json());
}

export function ComparisonWorkspace({
  comparisonId,
  initialComparison,
  issuerLabel,
  pairLabel,
}: {
  comparisonId: string;
  initialComparison?: Comparison;
  issuerLabel: string;
  pairLabel: string;
}) {
  const query = useQuery<Comparison>({
    queryKey: ["comparison", comparisonId],
    queryFn: () => fetchComparison(comparisonId),
    ...(initialComparison ? { initialData: initialComparison } : {}),
  });
  if (query.isLoading)
    return <LoadingState issuer={issuerLabel} pair={pairLabel} />;
  if (!query.data) return <ErrorState retry={() => void query.refetch()} />;
  return (
    <Workspace
      comparison={query.data}
      refreshError={query.isRefetchError}
      refreshing={query.isFetching}
      onRefresh={() => void query.refetch()}
    />
  );
}

function LoadingState({ issuer, pair }: { issuer: string; pair: string }) {
  return (
    <main
      id="main-content"
      className="page-shell state-page"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="eyebrow">Loading verified fixture</p>
      <h1>{issuer} Item 1A</h1>
      <p>Preparing the {pair} passage comparison and source references…</p>
      <div className="skeleton" aria-hidden="true" />
    </main>
  );
}

function ErrorState({ retry }: { retry: () => void }) {
  return (
    <main id="main-content" className="page-shell state-page">
      <div role="alert" className="alert error-alert">
        <p className="eyebrow">Comparison unavailable</p>
        <h1>The filing comparison could not be loaded.</h1>
        <p>
          No empty diff or cached result was fabricated. Your selected route and
          filters remain in the URL.
        </p>
        <button type="button" onClick={retry}>
          Retry comparison
        </button>
      </div>
    </main>
  );
}

function Workspace({
  comparison,
  refreshError,
  refreshing,
  onRefresh,
}: {
  comparison: Comparison;
  refreshError: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pendingHeadingFocus = useRef(false);
  const [announce, setAnnounce] = useState("");
  const [notes, setNotes] = useState<NoteMap>({});
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  const view: ViewMode = search.get("view") === "unified" ? "unified" : "split";
  const selectedTypes = useMemo(() => {
    const requested = search.get("types")?.split(",") ?? [...CHANGE_KINDS];
    const valid = CHANGE_KINDS.filter((kind) => requested.includes(kind));
    return new Set<ChangeKind>(valid.length ? valid : CHANGE_KINDS);
  }, [search]);
  const visible = useMemo(
    () => comparison.changes.filter((change) => selectedTypes.has(change.kind)),
    [comparison.changes, selectedTypes],
  );
  const requestedChange = search.get("change");
  const active =
    visible.find((change) => change.id === requestedChange) ??
    visible[0] ??
    null;
  const activeIndex = active
    ? visible.findIndex((change) => change.id === active.id)
    : -1;
  const excludedCount = comparison.exclusions.reduce(
    (total, exclusion) => total + exclusion.count,
    0,
  );

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(search.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}` as never, {
        scroll: false,
      });
    },
    [pathname, router, search],
  );

  useEffect(() => {
    try {
      // This effect intentionally synchronizes the initial client render with browser-local storage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotes(loadNotes(window.localStorage, comparison.id));
    } catch {
      setStorageWarning(
        "Browser storage is unavailable. Notes will remain available only for this session.",
      );
    }
  }, [comparison.id]);

  const moveTo = useCallback(
    (index: number) => {
      if (!visible.length) return;
      const next = visible[(index + visible.length) % visible.length]!;
      if (next.id === requestedChange) {
        setAnnounce(
          `Change ${visible.indexOf(next) + 1} of ${visible.length}, ${next.kind}.`,
        );
        requestAnimationFrame(() => headingRef.current?.focus());
        return;
      }
      pendingHeadingFocus.current = true;
      updateUrl({ change: next.id });
      setAnnounce(
        `Change ${visible.indexOf(next) + 1} of ${visible.length}, ${next.kind}.`,
      );
    },
    [requestedChange, updateUrl, visible],
  );

  useEffect(() => {
    if (!active || !pendingHeadingFocus.current) return;
    pendingHeadingFocus.current = false;
    const frame = requestAnimationFrame(() => headingRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [active, requestedChange]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || !["ArrowDown", "ArrowUp"].includes(event.key))
        return;
      const target = event.target as HTMLElement;
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.isContentEditable
      )
        return;
      event.preventDefault();
      moveTo(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, moveTo]);

  const setTypes = (kind: ChangeKind, checked: boolean) => {
    const next = new Set(selectedTypes);
    if (checked) next.add(kind);
    else next.delete(kind);
    if (!next.size) return;
    const ordered = CHANGE_KINDS.filter((candidate) => next.has(candidate));
    const firstVisible = comparison.changes.find((change) =>
      next.has(change.kind),
    );
    updateUrl({ types: ordered.join(","), change: firstVisible?.id ?? null });
    setAnnounce(
      `${comparison.changes.filter((change) => next.has(change.kind)).length} changes visible.`,
    );
  };

  const saveNote = (changeId: string, body: string): string | null => {
    const validation = validateNote(body);
    if (validation) return validation;
    const now = new Date().toISOString();
    const previous = notes[changeId];
    const note: ResearchNote = {
      changeId,
      comparisonId: comparison.id,
      body: body.trim(),
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
      schemaVersion: 1,
      storage: "local",
    };
    const next = { ...notes, [changeId]: note };
    setNotes(next);
    try {
      persistNotes(window.localStorage, comparison.id, next);
      setStorageWarning(null);
    } catch {
      setStorageWarning(
        "This note is kept for this session, but browser storage could not persist it.",
      );
    }
    return null;
  };

  const deleteNote = (changeId: string) => {
    const next = { ...notes };
    delete next[changeId];
    setNotes(next);
    try {
      persistNotes(window.localStorage, comparison.id, next);
      setStorageWarning(null);
    } catch {
      setStorageWarning(
        "The note was removed for this session, but browser storage could not be updated.",
      );
    }
  };

  const resetNotes = () => {
    setNotes({});
    try {
      persistNotes(window.localStorage, comparison.id, {});
      setStorageWarning(null);
    } catch {
      setStorageWarning(
        "Notes were cleared for this session, but browser storage could not be updated.",
      );
    }
  };

  return (
    <main id="main-content" className="page-shell comparison-page">
      <div className="live-region" aria-live="polite" aria-atomic="true">
        {announce}
      </div>
      <header className="comparison-header">
        <p className="eyebrow">
          {comparison.issuer.ticker} · Form 10-K · Item 1A only
        </p>
        <h1>{comparison.issuer.displayName}: what changed in Risk Factors?</h1>
        <p className="lede">
          Textual comparison only. A wording change is not a conclusion about
          risk direction or investment significance.
        </p>
        <Provenance comparison={comparison} />
        <ChangeLedger comparison={comparison} visibleCount={visible.length} />
      </header>

      {comparison.status === "partial" && (
        <section
          role="status"
          className="alert partial-alert"
          aria-labelledby="partial-title"
        >
          <p className="eyebrow">Partial comparison</p>
          <h2 id="partial-title">
            Only manually verified source passages are shown.
          </h2>
          <p>
            {excludedCount} excluded data set{excludedCount === 1 ? "" : "s"}:
          </p>
          <ul>
            {comparison.exclusions.map((exclusion) => (
              <li key={exclusion.code}>{exclusion.reason}</li>
            ))}
          </ul>
          <p>
            No conclusion should be drawn from passages not included in this
            local fixture.
          </p>
        </section>
      )}

      {refreshError && (
        <section role="alert" className="alert error-alert">
          <p className="eyebrow">Refresh unavailable</p>
          <h2>The comparison could not be refreshed.</h2>
          <p>
            The verified local fixture remains visible; route and filter state
            were preserved.
          </p>
          <button type="button" onClick={onRefresh}>
            Retry comparison
          </button>
        </section>
      )}

      <section
        className="review-controls"
        aria-labelledby="review-controls-heading"
      >
        <h2 id="review-controls-heading" className="visually-hidden">
          Review controls
        </h2>
        <fieldset className="filters">
          <legend>Change types</legend>
          {CHANGE_KINDS.map((kind) => (
            <label key={kind}>
              <input
                type="checkbox"
                checked={selectedTypes.has(kind)}
                onChange={(event) => setTypes(kind, event.target.checked)}
              />
              {kind === "added"
                ? "+ Added"
                : kind === "removed"
                  ? "− Removed"
                  : "~ Modified"}
            </label>
          ))}
        </fieldset>
        <fieldset className="view-toggle">
          <legend>View</legend>
          <label>
            <input
              type="radio"
              name="view"
              checked={view === "split"}
              onChange={() => updateUrl({ view: "split" })}
            />{" "}
            Split
          </label>
          <label>
            <input
              type="radio"
              name="view"
              checked={view === "unified"}
              onChange={() => updateUrl({ view: "unified" })}
            />{" "}
            Unified
          </label>
        </fieldset>
        <div className="navigation-controls" aria-label="Change navigation">
          <button
            type="button"
            onClick={() => moveTo(activeIndex - 1)}
            disabled={!visible.length}
          >
            ← Previous
          </button>
          <span>
            {visible.length
              ? `${activeIndex + 1} of ${visible.length}`
              : "0 visible"}
          </span>
          <button
            type="button"
            onClick={() => moveTo(activeIndex + 1)}
            disabled={!visible.length}
          >
            Next →
          </button>
        </div>
        <p className="shortcut">Keyboard: Alt + ↑ / ↓</p>
        <button
          type="button"
          className="quiet-button"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing…" : "Refresh local fixture"}
        </button>
      </section>

      {!active ? (
        comparison.counts.total === 0 ? (
          <section className="empty-state">
            <h2>No meaningful textual changes were detected</h2>
            <p>
              The deterministic comparison produced no reviewable text pairs.
              This does not mean the issuer&apos;s risk is unchanged.
            </p>
          </section>
        ) : (
          <section className="empty-state">
            <h2>No changes match these filters</h2>
            <p>
              Choose a change type to continue. The filing-level counts remain
              above.
            </p>
            <button
              type="button"
              onClick={() =>
                updateUrl({
                  types: CHANGE_KINDS.join(","),
                  change: comparison.changes[0]?.id ?? null,
                })
              }
            >
              Clear filters
            </button>
          </section>
        )
      ) : (
        <div className="workspace-grid">
          <article
            className={`change-review ${view}`}
            aria-labelledby="active-change-heading"
          >
            <header className={`change-heading ${active.kind}`}>
              <p className="change-type">
                {active.kind === "added"
                  ? "+ Added text"
                  : active.kind === "removed"
                    ? "− Removed text"
                    : "~ Wording modified"}
              </p>
              <h2 id="active-change-heading" ref={headingRef} tabIndex={-1}>
                Change {activeIndex + 1} of {visible.length}:{" "}
                {active.oldPassage?.headingPath[0] ??
                  active.newPassage?.headingPath[0]}
              </h2>
              <p className="change-id">{active.id}</p>
            </header>
            <PassageReview change={active} view={view} />
          </article>
          <NotePanel
            key={active.id}
            comparison={comparison}
            change={active}
            note={notes[active.id]}
            notes={notes}
            warning={storageWarning}
            onSave={saveNote}
            onDelete={deleteNote}
            onReset={resetNotes}
          />
        </div>
      )}
      <section className="method-strip" aria-labelledby="method-heading">
        <h2 id="method-heading">Method and boundary</h2>
        <p>{DISCLAIMER}</p>
        <p>
          Exact hashes are matched first; lightly edited passages are paired
          deterministically; ambiguous text remains explicit add/remove.
          Similarity is alignment evidence, never a user-facing severity score.
        </p>
      </section>
    </main>
  );
}

function ChangeLedger({
  comparison,
  visibleCount,
}: {
  comparison: Comparison;
  visibleCount: number;
}) {
  return (
    <div className="ledger-wrap">
      <dl className="change-ledger" aria-label="Textual change counts">
        <div>
          <dt>∑ Total</dt>
          <dd>{comparison.counts.total}</dd>
        </div>
        <div>
          <dt>+ Added</dt>
          <dd>{comparison.counts.added}</dd>
        </div>
        <div>
          <dt>− Removed</dt>
          <dd>{comparison.counts.removed}</dd>
        </div>
        <div>
          <dt>~ Modified</dt>
          <dd>{comparison.counts.modified}</dd>
        </div>
      </dl>
      <p className="visible-count">{visibleCount} visible</p>
    </div>
  );
}

function Provenance({ comparison }: { comparison: Comparison }) {
  return (
    <section className="provenance" aria-labelledby="provenance-heading">
      <h2 id="provenance-heading" className="visually-hidden">
        Filing provenance
      </h2>
      {[comparison.olderFiling, comparison.newerFiling].map((filing, index) => (
        <div key={filing.id}>
          <p className="provenance-label">
            {index === 0 ? "Prior filing" : "Current filing"}
          </p>
          <p>
            <strong>Period</strong> {filing.periodEnd}
          </p>
          <p>
            <strong>Filed</strong> {filing.filedAt}
          </p>
          <p className="wrap-anywhere">
            <strong>Accession</strong> {filing.accession}
          </p>
          <p>
            <strong>Retrieved</strong> {filing.retrievedAt.slice(0, 10)}
          </p>
          <p>
            <strong>Source hash</strong>{" "}
            <span className="wrap-anywhere">
              {filing.sha256
                ? filing.sha256
                : "Pending authorized raw ingestion"}
            </span>
          </p>
          <p>
            <a
              href={filing.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open official {index === 0 ? "prior" : "current"} SEC filing —
              Item 1A locator (new tab)
            </a>
          </p>
          <p>
            <a href={filing.indexUrl} target="_blank" rel="noopener noreferrer">
              Open filing index (new tab)
            </a>
          </p>
        </div>
      ))}
    </section>
  );
}

function PassageReview({ change, view }: { change: Change; view: ViewMode }) {
  if (view === "unified") {
    return (
      <div className="unified-passages">
        {change.oldPassage && (
          <PassageRegion
            label="Prior filing passage"
            passage={change.oldPassage}
            spans={change.oldWordSpans}
          />
        )}
        {change.newPassage && (
          <PassageRegion
            label="Current filing passage"
            passage={change.newPassage}
            spans={change.newWordSpans}
          />
        )}
      </div>
    );
  }
  return (
    <div className="split-passages">
      {change.oldPassage ? (
        <PassageRegion
          label="Prior filing passage"
          passage={change.oldPassage}
          spans={change.oldWordSpans}
        />
      ) : (
        <UnavailablePassage label="Prior filing passage" />
      )}
      {change.newPassage ? (
        <PassageRegion
          label="Current filing passage"
          passage={change.newPassage}
          spans={change.newWordSpans}
        />
      ) : (
        <UnavailablePassage label="Current filing passage" />
      )}
    </div>
  );
}

function PassageRegion({
  label,
  passage,
  spans,
}: {
  label: string;
  passage: Passage;
  spans: WordSpan[];
}) {
  return (
    <section className="passage-region" aria-label={label}>
      <p className="passage-label">{label}</p>
      <p className="source-locator">{passage.source.locatorLabel}</p>
      <blockquote>
        {spans.map((span, index) => (
          <DiffSpan key={`${index}-${span.kind}`} span={span} />
        ))}
      </blockquote>
      <details>
        <summary>Source context and locator</summary>
        <p>
          No adjacent context block is available in this bounded manually
          reviewed fixture.
        </p>
        <p className="wrap-anywhere">Block: {passage.blockId}</p>
        <a
          href={passage.source.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify this passage in the official SEC filing (new tab)
        </a>
      </details>
    </section>
  );
}

function DiffSpan({ span }: { span: WordSpan }) {
  if (span.kind === "added")
    return (
      <ins>
        <span className="visually-hidden">added text starts </span>
        {span.text}
        <span className="visually-hidden"> added text ends</span>
      </ins>
    );
  if (span.kind === "removed")
    return (
      <del>
        <span className="visually-hidden">removed text starts </span>
        {span.text}
        <span className="visually-hidden"> removed text ends</span>
      </del>
    );
  return <>{span.text}</>;
}

function UnavailablePassage({ label }: { label: string }) {
  return (
    <section className="passage-region unavailable" aria-label={label}>
      <p className="passage-label">{label}</p>
      <p>No corresponding passage is available in this filing.</p>
    </section>
  );
}

function NotePanel({
  comparison,
  change,
  note,
  notes,
  warning,
  onSave,
  onDelete,
  onReset,
}: {
  comparison: Comparison;
  change: Change;
  note: ResearchNote | undefined;
  notes: NoteMap;
  warning: string | null;
  onSave: (id: string, body: string) => string | null;
  onDelete: (id: string) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(note?.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const count = Object.keys(notes).length;

  useEffect(() => {
    if (!note?.body || draft) return;
    // A persisted note becomes available after browser storage hydrates on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(note.body);
  }, [draft, note?.body]);

  return (
    <aside className="note-panel" aria-labelledby="note-heading">
      <p className="eyebrow">Browser-local research note</p>
      <h2 id="note-heading">What should you investigate next?</h2>
      <p>
        Plain text only. Notes stay in this browser and are never sent to a
        server.
      </p>
      <label htmlFor="note-body">Note for change {change.ordinal}</label>
      <textarea
        id="note-body"
        value={draft}
        maxLength={MAX_NOTE_LENGTH + 1}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
          setStatus(null);
        }}
        aria-describedby={`note-count${error ? " note-error" : ""}`}
      />
      <p id="note-count" className="character-count">
        {draft.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}
      </p>
      {error && (
        <p id="note-error" role="alert" className="field-error">
          {error}
        </p>
      )}
      {warning && (
        <p role="status" className="storage-warning">
          {warning}
        </p>
      )}
      {status && (
        <p role="status" className="save-status">
          {status}
        </p>
      )}
      <div className="note-actions">
        <button
          type="button"
          onClick={() => {
            const result = onSave(change.id, draft);
            if (result) setError(result);
            else setStatus("Saved in this browser.");
          }}
        >
          Save note
        </button>
        <button
          type="button"
          className="quiet-button"
          disabled={!note}
          onClick={() => {
            onDelete(change.id);
            setDraft("");
            setStatus("Note deleted.");
          }}
        >
          Delete note
        </button>
      </div>
      {note && (
        <p className="saved-at">
          Updated {new Date(note.updatedAt).toLocaleString()}
        </p>
      )}
      <hr />
      <h3>Carry notes forward</h3>
      <p>
        {count} saved {count === 1 ? "note" : "notes"} for this comparison.
      </p>
      <button
        type="button"
        disabled={!count}
        onClick={() => downloadNotes(comparison, notes)}
      >
        Download notes as Markdown
      </button>
      {!count && (
        <p className="button-explanation">
          Save at least one note to enable export.
        </p>
      )}
      <button
        type="button"
        className="danger-button"
        disabled={!count}
        onClick={() => {
          onReset();
          setDraft("");
          setError(null);
          setStatus("All notes cleared for this comparison.");
        }}
      >
        Reset all notes for this comparison
      </button>
    </aside>
  );
}
