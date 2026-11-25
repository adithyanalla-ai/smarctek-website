# SMARCTEK LLC website

Multi-page corporate website for **SMARCTEK LLC** (Glastonbury, Connecticut). 38 static pages generated from typed data, plus a small Node server that serves them and delivers quote enquiries by email.

> **Not ready to publish yet.** Three things are open: written permission to use the TGG Group photographs, owner approval of the wording in `docs/UNVERIFIED_CLAIMS.md`, and engineering review of `docs/SPEC_REVIEW_FLAGS.md`. See `docs/DEPLOYMENT.md` §1.

## Quick start

```bash
npm ci
npm run build          # → dist/   (38 pages, sitemap.xml, robots.txt, docs/SPEC_REVIEW_FLAGS.md)
npm start              # http://localhost:8080  (form returns 503 until mail is configured)
```

Requires Node ≥ 20. The server has **no runtime dependencies**.

To send real enquiries: copy `.env.example` to `.env`, fill in the Resend values, and start with `node --env-file=.env server/server.mjs`.

## Tests

```bash
npm test               # build + static audit + end-to-end enquiry tests
npm run test:ui        # browser behaviour (needs the server running: BASE=http://localhost:8080)
npm run typecheck
```

| Suite | What it proves |
|-------|----------------|
| `tests/audit.mjs` | Every internal link/anchor resolves; titles, descriptions, canonicals and OG tags present and unique; JSON-LD parses; every image has alt text and dimensions; one `h1` and no skipped heading levels per page; sitemap matches built pages; no invoice, bank, price, payment or time-unit-on-400-ton text leaked. |
| `tests/e2e.mjs` | Validation blocks bad input; a valid enquiry with an attachment reaches the (mock) mail provider with the correct recipient and reply-to; **provider failure and missing configuration show an error, never a fake success**; honeypot, too-fast and forged-token submissions send nothing. |
| `tests/vercel-api.mjs` | The `api/` functions work under `VERCEL=1`: enquiry accepted, 4 MB cap enforced with a clear message, honeypot and validation work, and mail is refused without `FORM_SECRET`. |
| `tests/ui.mjs` | Catalogue search and filters, quote shortlist persistence, process-flow navigation, lightbox open/close, mobile nav, no horizontal overflow at 360/390/768/1024/1440 px on ten key pages. |

`npm run typecheck` reports only the missing React type packages when run in a network-less environment. Run `npm ci` first.

## Project layout

```
src/
  data/products.ts     19 machines: specs, applications, `review` flags for withheld specs
  data/content.ts      solutions, process stages, engineering list, gallery, countries
  pages/               home.tsx, inner.tsx (all other pages)
  components/          Layout (head/SEO/JSON-LD, header, footer), blocks (catalogue, form, map…), ui
  client/main.ts       all browser behaviour (progressive enhancement; pages work without JS)
  styles/              design tokens (base.css) and section styles
  lib/config.ts        site constants, image-permission flag, nav
  build.tsx            routes, validation, JSON-LD, sitemap/robots, bundling
server/server.mjs      static files + /api/form-token + /api/enquiry (self-hosted)
api/                   the same enquiry endpoints as Vercel serverless functions
vercel.json            Vercel build, headers and routing
scripts/               extract_assets.py (PDF → WebP), make_og.py
public/images/         processed photos, logo, favicons, OG image
docs/                  DEPLOYMENT.md, UNVERIFIED_CLAIMS.md, SPEC_REVIEW_FLAGS.md (generated)
```

## Editing

- **Copy:** `src/data/*.ts` and `src/pages/*.tsx`. Rebuild with `npm run build`.
- **Add or change a machine:** edit `src/data/products.ts`. Product page, catalogue card, sitemap entry and JSON-LD are generated. Set `review: true` on any spec that must stay hidden.
- **Colours and type:** CSS variables at the top of `src/styles/base.css` (navy `#082451`, orange `#FF5126`).
- **Re-extract images** from the source PDF: `npm run assets` (needs `poppler-utils` and Python Pillow).

## Design notes

- White text on the brand orange is only 3.25:1, so orange buttons use deep-navy text (5.47:1). Small orange text on light backgrounds uses a darker derived `#C2370F` (5.46:1).
- Every page works without JavaScript. The quote buttons fall back to `/request-a-quote/?add=<slug>`.
- Specifications flagged for review are withheld from public pages by default (`PUBLISH_UNREVIEWED_SPECS=true` overrides at build time).
