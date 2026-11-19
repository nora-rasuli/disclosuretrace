import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PRODUCT_NAME, SEC_ATTRIBUTION } from "@/config/product";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: PRODUCT_NAME, template: `%s · ${PRODUCT_NAME}` },
  description:
    "A source-linked, deterministic Item 1A filing comparison workspace.",
  icons: { icon: "/favicon.svg" },
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
