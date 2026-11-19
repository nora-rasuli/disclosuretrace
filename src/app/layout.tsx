import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PRODUCT_NAME, SEC_ATTRIBUTION } from "@/config/product";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://disclosuretrace.vercel.app"),
  title: { default: PRODUCT_NAME, template: `%s · ${PRODUCT_NAME}` },
  description:
    "Retrieve and compare the latest annual Item 1A risk disclosures from SEC EDGAR.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: "/",
    title: PRODUCT_NAME,
    description:
      "Retrieve the latest annual filings and review year-over-year Item 1A wording changes with source-linked SEC context.",
    images: [
      {
        url: "/social-preview.svg",
        width: 1280,
        height: 640,
        alt: "Disclosure Trace source-linked filing comparison workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT_NAME,
    description:
      "Retrieve the latest annual filings and review year-over-year Item 1A wording changes with source-linked SEC context.",
    images: ["/social-preview.svg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="site-header">
          <Link href="/" className="wordmark">
            {PRODUCT_NAME}
          </Link>
          <span className="working-title">Source-linked filing comparison</span>
        </header>
        <Providers>{children}</Providers>
        <footer className="site-footer">
          <p>{SEC_ATTRIBUTION}</p>
        </footer>
      </body>
    </html>
  );
}
