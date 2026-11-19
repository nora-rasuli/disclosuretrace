import Link from "next/link";
import { LiveCompanySearch } from "@/components/live-company-search";
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
          Retrieve a company’s two latest annual 10-Ks, isolate Item 1A, and
          review every wording change against the original SEC text.
        </p>
        <p className="disclosure">{CONCEPT_DISCLOSURE}</p>
        <p className="disclaimer">{DISCLAIMER}</p>
        <LiveCompanySearch />
      </section>
      <section
        aria-labelledby="comparisons-heading"
        className="catalog-section"
      >
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Saved examples</p>
            <h2 id="comparisons-heading">
              See the review workflow immediately
            </h2>
          </div>
          <p className="method-note">
            These verified examples remain available when SEC EDGAR is slow or
            unavailable.
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
                  <p className="partial-label">Verified passage set</p>
                )}
              </div>
              <Link
                href={
                  `${item.route}?view=split&types=added,removed,modified` as never
                }
                className="primary-link"
                aria-label={`Compare ${item.displayName} Item 1A filings`}
              >
                Open saved example <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
