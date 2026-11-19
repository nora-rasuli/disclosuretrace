import Link from "next/link";
import { CONCEPT_DISCLOSURE, DISCLAIMER } from "@/config/product";
import { loadCatalog } from "@/data/fixture-store";

export default async function HomePage() {
  const catalog = await loadCatalog();
  return (
    <main id="main-content" className="page-shell index-page">
      <section className="intro" aria-labelledby="intro-heading">
        <p className="eyebrow">Annual filing research workspace</p>
        <h1 id="intro-heading">See what changed between annual filings.</h1>
        <p className="lede">
          Review Item 1A wording changes with every finding connected to the
          original SEC text.
        </p>
        <p className="disclosure">{CONCEPT_DISCLOSURE}</p>
        <p className="disclaimer">{DISCLAIMER}</p>
      </section>
      <section
        aria-labelledby="comparisons-heading"
        className="catalog-section"
      >
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Frozen corpus · fixture v1</p>
            <h2 id="comparisons-heading">Five verified filing pairs</h2>
          </div>
          <p className="method-note">
            10-K · Item 1A only · No live public fetching
          </p>
        </div>
        <ol className="catalog-list">
          {catalog.items.map((item, index) => (
            <li key={item.ticker} className="catalog-item">
              <div className="catalog-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="catalog-copy">
                <p className="ticker">{item.ticker}</p>
                <h3>{item.displayName}</h3>
                <p>
                  {item.older.periodEnd} → {item.newer.periodEnd}
                </p>
                <p className="accessions">
                  {item.older.accession}
                  <br />
                  {item.newer.accession}
                </p>
                {item.status === "partial" && (
                  <p className="partial-label">
                    Manually verified passage set · full ingestion pending
                  </p>
                )}
              </div>
              <Link
                href={
                  `${item.route}?view=split&types=added,removed,modified` as never
                }
                className="primary-link"
                aria-label={`Compare ${item.displayName} Item 1A filings`}
              >
                Compare <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
