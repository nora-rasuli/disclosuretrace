import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell state-page">
      <p className="eyebrow">Unknown comparison</p>
      <h1>This route is not in the verified five-pair catalog.</h1>
      <p>No arbitrary issuer, filing, or section is loaded.</p>
      <Link href="/" className="primary-link">
        Return to verified comparisons
      </Link>
    </main>
  );
}
