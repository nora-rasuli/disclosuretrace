"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="page-shell state-page">
      <h1>The workspace could not be loaded.</h1>
      <p>
        No filing comparison was fabricated. Retry or return to the catalog.
      </p>
      <button type="button" onClick={reset}>
        Retry
      </button>
    </main>
  );
}
