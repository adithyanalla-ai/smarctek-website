# Deployment guide

The site is two things:

1. **`dist/`**: static HTML, CSS, JS and images, produced by `npm run build`.
2. **`server/server.mjs`**: a zero-dependency Node (≥ 20) server that serves `dist/` with caching and security headers **and** provides the enquiry API (`GET /api/form-token`, `POST /api/enquiry`).

The quote form needs the Node server or the equivalent Vercel functions in `api/`. Hosting `dist/` on a purely static host (S3, GitHub Pages, Netlify without functions) gives you a working website but **a form that reports an error instead of sending**. It will never pretend to succeed.

## 1. Before going live (checklist)

| # | Item | Why |
|---|------|-----|
| 1 | Obtain **written permission from TGG Group** to use their photographs, then set `permissionConfirmed: true` in `src/lib/config.ts` | The photos come from a supplier proforma. The build prints a warning until this is set. |
| 2 | Work through `docs/UNVERIFIED_CLAIMS.md` with the business owner | Every sentence that describes what Smarctek does, owns or provides needs approval. |
| 3 | Have an engineer review `docs/SPEC_REVIEW_FLAGS.md` | Specifications with inconsistencies are withheld from public pages until cleared. |
| 4 | Verify your sending domain in Resend and set the env vars below | Without them the form returns HTTP 503. |
| 5 | Ask a lawyer to review the Privacy Policy and Terms | Both are drafts. |
| 6 | Replace low-resolution photos if TGG can supply originals | The PDF images are ~100–650 px wide and have been upscaled. |
| 7 | Re-run `npm test` and a real Lighthouse run against the deployed URL | Scores in this repo are targets, not measured results. |

## 2. Environment variables

See `.env.example`. Summary:

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | yes | API key from <https://resend.com>. |
| `MAIL_FROM` | yes | e.g. `SMARCTEK Website <enquiries@smarctekllc.com>`. The domain must be verified in Resend (add the DNS records Resend shows: SPF, DKIM, optionally DMARC). |
| `ENQUIRY_TO` | no (default `info@smarctekllc.com`) | Where enquiries are delivered. `reply_to` is always the submitter's address. |
| `FORM_SECRET` | yes in production | Signs the anti-bot time token. Use `openssl rand -hex 32`. Must be identical across instances. |
| `PORT`, `HOST` | no | Default `8080` / `0.0.0.0`. |
| `TRUST_PROXY=1` | when behind a proxy | Reads the client IP from `X-Forwarded-For` for rate limiting. Do **not** set it when exposed directly to the internet. |
| `RATE_LIMIT_PER_HOUR` | no (default 5) | Enquiries per IP per hour. |
| `TURNSTILE_SECRET` / `TURNSTILE_SITE_KEY` | optional | Cloudflare Turnstile. The **site key is read at build time**; the secret at runtime. If unset, the honeypot, time-trap and rate limit still apply. |
| `SITE_URL` | build time | Used for canonical URLs, sitemap and Open Graph. Default `https://www.smarctekllc.com`. |
| `MAX_TOTAL_UPLOAD_MB` | no (default 15; 4 on Vercel) | Total attachment size cap. |
| `ENQUIRY_LOG_DIR` | no | **Every** enquiry (sent or failed) is written here as a JSON file containing the submitter's details, message and attachment *names* (not file contents), so none is silently lost. This is personal data: mount a persistent, access-restricted volume, and set a retention/deletion routine that matches the Privacy Policy. |
| `PUBLISH_UNREVIEWED_SPECS` | build time | Leave `false` until engineering has cleared the flagged specifications. |

## 3. Deploy options

### A. Any Node host (Render, Railway, Fly.io, a VPS)

```bash
npm ci
SITE_URL=https://www.smarctekllc.com TURNSTILE_SITE_KEY=... npm run build
RESEND_API_KEY=... MAIL_FROM=... FORM_SECRET=... TRUST_PROXY=1 npm start
```

Put the host behind TLS (most platforms do this for you) and point `www.smarctekllc.com` at it. Redirect the apex domain to `www` (or the reverse) at your DNS/CDN so there is one canonical host.

### B. Docker

```bash
docker build -t smarctek-site --build-arg TURNSTILE_SITE_KEY=... .
docker run -d -p 8080:8080 --env-file .env -v smarctek-data:/app/data smarctek-site
```

### D. Git + Vercel (recommended for simplicity)

The repo is Vercel-ready: `vercel.json` sets the build (`npm run build` → `dist/`), security headers and trailing-slash URLs, and `api/*.mjs` are serverless functions that reuse the same enquiry logic as `server/server.mjs`.

1. Commit everything and push to GitHub. (Optional but recommended: run `npm install` once locally and commit the generated `package-lock.json` for reproducible builds.)
2. In Vercel: **Add New → Project → import the repo**. Leave the framework as *Other*; the settings come from `vercel.json`.
3. Under **Settings → Environment Variables** (Production and Preview) add:
   - `RESEND_API_KEY`, `MAIL_FROM`, `ENQUIRY_TO`
   - **`FORM_SECRET`** (mandatory on Vercel; without it the form answers 503 on purpose, because each function instance would otherwise sign tokens with a different secret)
   - `SITE_URL=https://www.smarctekllc.com` (used at build time for canonicals, sitemap, Open Graph)
   - optional: `TURNSTILE_SITE_KEY` (build time) and `TURNSTILE_SECRET`
4. Deploy, then **Settings → Domains**: add `www.smarctekllc.com` (and the apex, set to redirect to www) and create the DNS records Vercel shows.
5. Verify `https://<your-deployment>/api/health` returns `{"ok":true,"mail":true}`, then submit a real test enquiry.

Differences from running the Node server:

| Topic | On Vercel |
|-------|-----------|
| Attachments | Vercel rejects request bodies over ~4.5 MB, so the cap is **4 MB in total** (the form tells the user if they exceed it). Override with `MAX_TOTAL_UPLOAD_MB`, but never above 4 on Vercel. |
| Enquiry log files | The filesystem is read-only. Sent enquiries exist only as the email. A **failed** delivery is written to the function logs (Vercel → Logs) with the submitter's details so it can be recovered. Treat those logs as personal data. |
| Rate limiting | The in-memory limiter is per function instance, so it is only a light brake. Enable Cloudflare Turnstile for real protection. |
| Headers | Set in `vercel.json` (same CSP as the Node server). Edit both places if you change the CSP, for example when self-hosting fonts. |
| Preview deployments | Every branch gets a preview URL. Add the same env vars to *Preview* to test the form there. Previews are public by default unless Vercel deployment protection is on. Turn it on while the TGG photo permission is outstanding. |

Not yet tested on a real Vercel project (no account access here). The handlers were tested locally with `VERCEL=1` (`node tests/vercel-api.mjs`).

### C. Static host for the pages + the Node server for the API only

Serve `dist/` from a CDN and route `/api/*` to the Node server. The CSP in `server/server.mjs` is set by the Node server; replicate those headers at your CDN (see the `SEC` object in the server file).

## 4. After deploying

1. Open `/request-a-quote/`, submit a real test enquiry, and confirm it arrives at `info@smarctekllc.com` with the right reply-to.
2. Submit once with the mail variables unset in a staging copy to confirm you see the error message (never a success message).
3. Submit `https://www.smarctekllc.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
4. Run Lighthouse (Chrome DevTools → Lighthouse, mobile) on `/`, `/products/` and a product page. Record the real scores.
5. Check `https://www.smarctekllc.com/robots.txt`. `/api/` is disallowed and the sitemap is declared.

## 5. Fonts and privacy

Manrope/Inter load from Google Fonts at runtime, which sends visitors' IP addresses to Google. To avoid that (recommended for EU visitors), download the font files, place them in `public/fonts/`, add `@font-face` rules in `src/styles/base.css`, remove the Google Fonts `<link>` tags in `src/components/Layout.tsx`, and drop `fonts.googleapis.com` / `fonts.gstatic.com` from the CSP in `server/server.mjs`. The Privacy Policy mentions Google Fonts. Update it if you self-host.

## 6. Operating notes

- The rate limiter and token store are in memory. Run a single instance, or use sticky routing; the time-trap token is stateless (HMAC) so it works across instances provided `FORM_SECRET` matches.
- Uploads are limited to 3 files × 5 MB. Accepted types: PDF, Word, Excel, JPG, PNG and ZIP. Extensions and magic bytes are both checked, and attachment contents are forwarded in the email only (never written to disk). CAD files (e.g. DWG) are not accepted. Ask buyers to zip them or send a PDF export, or add the extension and a signature check in `server/server.mjs` and `src/client/main.ts`.
- To change copy, edit `src/data/*.ts` and `src/pages/*.tsx`, then rebuild. To change colours, edit the CSS variables at the top of `src/styles/base.css`.
