import type { ReactNode } from "react";
import { SITE, NAV, IMAGE_SOURCE } from "../lib/config";
import { SOLUTIONS } from "../data/content";
import { CATEGORIES } from "../data/products";
import { Icon, Btn } from "./ui";

export interface PageMeta {
  title: string;
  description: string;
  path: string; // e.g. "/about-us/"
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: object[];
  /** hide mobile sticky CTA (pages with the form) */
  hideMobileCta?: boolean;
  ogType?: string;
}

const fonts =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap";

export function Document({ meta, children, assetVersion }: { meta: PageMeta; children: ReactNode; assetVersion: string }) {
  const canonical = SITE.url + meta.path;
  const og = SITE.url + (meta.ogImage ?? "/images/brand/og-default.jpg");
  return (
    <html lang="en" className="no-js">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        {meta.noindex ? <meta name="robots" content="noindex,follow" /> : <meta name="robots" content="index,follow,max-image-preview:large" />}
        <meta name="theme-color" content="#082451" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:type" content={meta.ogType ?? "website"} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={og} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={SITE.locale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={og} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon-32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={fonts} />
        <script src={`/assets/boot.js?v=${assetVersion}`} />
        <link rel="stylesheet" href={`/assets/site.css?v=${assetVersion}`} />
        {(meta.jsonLd ?? []).map((o, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
        ))}
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <TopBar />
        <Header path={meta.path} />
        <main id="main">{children}</main>
        <Footer />
        <QuoteDock hideMobileCta={meta.hideMobileCta} />
        <Lightbox />
        <div className="toast" role="status" aria-live="polite" id="toast" />
        <script src={`/assets/main.js?v=${assetVersion}`} defer />
      </body>
    </html>
  );
}

function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <a href={`mailto:${SITE.email.info}`} className="topbar__item">
          <Icon name="mail" size={15} />
          <span>{SITE.email.info}</span>
        </a>
        <a href={`tel:${SITE.phoneHref}`} className="topbar__item">
          <Icon name="phone" size={15} />
          <span>{SITE.phone}</span>
        </a>
        <span className="topbar__item topbar__loc">
          <Icon name="map-pin" size={15} />
          <span>Glastonbury, Connecticut, USA</span>
        </span>
      </div>
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`brand ${className}`} aria-label="SMARCTEK LLC, home">
      <img src="/images/brand/smarctek-logo.webp" alt="" width="298" height="248" className="brand__mark" />
      <span className="brand__word">
        SMARCTEK <span>LLC</span>
      </span>
    </a>
  );
}

function Header({ path }: { path: string }) {
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className="site-header" id="site-header">
      <div className="container site-header__inner">
        <Logo />
        <nav className="nav" id="primary-nav" aria-label="Primary">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={active(n.href) ? "page" : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__cta-mobile">
            <Btn href="/request-a-quote/" icon="arrow-right" className="btn--block">Request a Quote</Btn>
          </div>
        </nav>
        <div className="site-header__actions">
          <a href="/request-a-quote/" className="quote-pill" aria-label="Quote list">
            <Icon name="list" size={18} />
            <span className="quote-pill__label">Quote list</span>
            <span className="quote-pill__count" data-quote-count hidden>0</span>
          </a>
          <Btn href="/request-a-quote/" className="site-header__cta" size="sm">Request a Quote</Btn>
          <button type="button" className="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
            <Icon name="menu" size={24} className="nav-toggle__open" />
            <Icon name="x" size={24} className="nav-toggle__close" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-grid-bg" aria-hidden="true" />
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="footer-logo" aria-label="SMARCTEK LLC, home">
              <img src="/images/brand/smarctek-logo.webp" alt="SMARCTEK LLC" width="298" height="248" loading="lazy" />
            </a>
            <p>
              SMARCTEK LLC is a Connecticut-based business focused on industrial machinery, agricultural processing systems, equipment sourcing and international project opportunities.
            </p>
            <p className="footer-tag">{SITE.tagline}</p>
          </div>
          <FooterCol title="Quick links">
            {NAV.map((n) => (
              <li key={n.href}><a href={n.href}>{n.label}</a></li>
            ))}
            <li><a href="/request-a-quote/">Request a Quote</a></li>
          </FooterCol>
          <FooterCol title="Industrial solutions">
            {SOLUTIONS.map((s) => (
              <li key={s.slug}><a href={`/solutions/${s.slug}/`}>{s.name}</a></li>
            ))}
          </FooterCol>
          <FooterCol title="Product categories">
            {CATEGORIES.map((c) => (
              <li key={c.id}><a href={`/products/?category=${c.id}`}>{c.label}</a></li>
            ))}
          </FooterCol>
          <div className="footer-col">
            <h2>Contact</h2>
            <address>
              <p>
                {SITE.address.street},<br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}, {SITE.address.country}
              </p>
              <p><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></p>
              <p><a href={`mailto:${SITE.email.info}`}>{SITE.email.info}</a></p>
              <p><a href={`mailto:${SITE.email.contact}`}>{SITE.email.contact}</a></p>
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p className="footer-credit">
            Equipment and facility photographs: {IMAGE_SOURCE.owner}, shown as reference images.
          </p>
          <ul>
            <li><a href="/privacy-policy/">Privacy Policy</a></li>
            <li><a href="/terms-of-use/">Terms of Use</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="footer-col">
      <h2>{title}</h2>
      <ul>{children}</ul>
    </div>
  );
}

function QuoteDock({ hideMobileCta }: { hideMobileCta?: boolean }) {
  return (
    <>
      {hideMobileCta ? null : (
        <div className="mobile-cta" role="region" aria-label="Quick enquiry">
          <a href="/request-a-quote/" className="btn btn--primary btn--md mobile-cta__main">
            <span>Request a Quote</span>
            <span className="mobile-cta__count" data-quote-count hidden>0</span>
          </a>
          <a href={`tel:${SITE.phoneHref}`} className="btn btn--navy btn--md mobile-cta__call" aria-label={`Call ${SITE.phone}`}>
            <Icon name="phone" size={18} />
          </a>
        </div>
      )}
      <button type="button" className="to-top" id="to-top" aria-label="Scroll to top" hidden>
        <Icon name="arrow-up" size={20} />
      </button>
    </>
  );
}

function Lightbox() {
  return (
    <dialog className="lightbox" id="lightbox" aria-label="Image viewer">
      <div className="lightbox__bar">
        <p className="lightbox__count" aria-live="polite" />
        <button type="button" className="lightbox__close" aria-label="Close image viewer">
          <Icon name="x" size={24} />
        </button>
      </div>
      <button type="button" className="lightbox__nav lightbox__prev" aria-label="Previous image">
        <Icon name="chevron-left" size={28} />
      </button>
      <figure className="lightbox__fig">
        <img alt="" />
        <figcaption />
      </figure>
      <button type="button" className="lightbox__nav lightbox__next" aria-label="Next image">
        <Icon name="chevron-right" size={28} />
      </button>
    </dialog>
  );
}
