"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LiveCompanySearch() {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      className="company-search"
      onSubmit={(event) => {
        event.preventDefault();
        const normalized = ticker.trim().toUpperCase();
        if (!/^[A-Z][A-Z0-9.-]{0,9}$/.test(normalized)) {
          setError("Enter a valid ticker, such as CRWD or COST.");
          return;
        }
        setError("");
        router.push(
          `/compare/live/${encodeURIComponent(normalized.toLowerCase())}` as never,
        );
      }}
    >
      <label htmlFor="company-ticker">Company ticker</label>
      <div className="company-search-row">
        <input
          id="company-ticker"
          name="ticker"
          value={ticker}
          onChange={(event) => setTicker(event.target.value)}
          placeholder="e.g. CRWD"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="ticker-help ticker-error"
        />
        <button type="submit">Compare latest 10-Ks</button>
      </div>
      <p id="ticker-help" className="field-help">
        Disclosure Trace retrieves the company’s two latest annual 10-Ks from
        SEC EDGAR and compares Item 1A.
      </p>
      <p id="ticker-error" className="field-error" aria-live="polite">
        {error}
      </p>
    </form>
  );
}
