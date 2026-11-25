# Unverified business claims requiring approval

The brief and the supplier proforma did not state what Smarctek actually does, owns, employs or is certified for. Where the site had to say something, it was written **conservatively and neutrally**, but every item below is still wording that **Smarctek must confirm, change or delete before launch**. Nothing here has been checked with the business.

Status key: ☐ not reviewed · ✔ approved · ✎ change needed

## A. What Smarctek does

| ☐ | Claim as it appears | Where | Question for the owner |
|---|---|---|---|
| ☐ | "SMARCTEK LLC is a Connecticut-based business focused on industrial machinery, agricultural processing systems, equipment sourcing and international project opportunities." | Footer, About hero, meta descriptions | Is this an accurate one-line description? Is "equipment sourcing" a service you offer? |
| ☐ | "We start from what a plant needs to produce… then look at machinery and integrated processing configurations that fit." (and similar "requirement-focused" wording) | Home intro, About, Why Smarctek | Is this how you really work with customers? |
| ☐ | Engineering and integration list: equipment configuration, processing line design, material flow planning, piping, PLC wiring and control, installation requirements, technical project coordination | Home §6, About, Solutions | **Which of these does Smarctek actually perform, which does a supplier perform, and which are only "discussed"?** The site currently says involvement is "agreed for each project" and never claims Smarctek does all of it. Confirm this is right. |
| ☐ | Installation and commissioning are referenced as scope items | Engineering section, cassava solution page | Does Smarctek arrange, supervise or only discuss installation? |
| ☐ | "Irrigation-related project enquiries, subject to confirmation of scope" | Solutions (7th category), home strip | The brief named irrigation but gave no detail. Keep, reword or remove? What does it cover? |
| ☐ | Vision, approach and values copy (Why Smarctek, six points) | About, Home §7 | Written as a neutral draft. Replace with the owner's real positioning. |
| ☐ | "A USA-based contact for discussions that cross borders and time zones." | Why Smarctek #4 | Accurate? Are other languages or regions served? |
| ☐ | Tagline "Engineering Solutions. Connecting Global Opportunities." | Header, footer, meta | Taken from the letterhead. Hero headline "Engineering Solutions for a World in Motion." is a **suggestion**. |

## B. Third parties and project references

| ☐ | Claim | Where | Question |
|---|---|---|---|
| ☐ | **TGG Group is named publicly** as the source of photographs and the reference proposal | Image credits, gallery note, footer, Projects, legal pages | Do you have TGG's consent to be named? Does the commercial relationship permit it? |
| ☐ | **TGG photographs** (all product, gallery and engineering images) | Entire site | **Permission has not been obtained.** The build warns until `IMAGE_SOURCE.permissionConfirmed` is set. Do not publish without written permission. |
| ☐ | The 400-ton cassava line is described as a **reference project concept**, not delivered, commissioned, completed or owned by Smarctek | Home §3, Projects, Solutions | Confirm the framing and whether the project may be shown at all. |
| ☐ | "Türkiye origin / Luanda, Angola" shown as **reference project context** with a map marker | Home §8, Global Business | Confirm these may be shown. The site states it does not imply offices or operations in either country. |
| ☐ | Equipment names, model numbers and technical specifications reproduced from the TGG proforma | Products, Solutions | Confirm TGG permits reproducing its specification. Quantities, prices, payment terms, invoice and bank details are **not** published. |

## C. Specifications flagged for technical review

See the auto-generated `docs/SPEC_REVIEW_FLAGS.md`. In summary:

- Specs with internal inconsistencies are **withheld** from public pages (elevator "8 ton/h Wheat" capacity and belt/bucket counts; breaker "Hatdox" knives; plansifter sieve/frame counts and cloth origin; packaging density, power and compressed-air figures).
- Wheat/corn machines appear in a cassava line. Suitability is unconfirmed.
- The conveyor capacity (10–15 t/h of flour) **is** published as the source states it. Confirm or withhold.
- The 400-ton headline has **no stated time basis** and the site deliberately adds none.
- Packaging machine is marked "ALT" in the source (alternative or included?).
- Several translated names ("Eklüs", "Vibro Tarar", "ruseym") are interpretations.

## D. Business and legal facts

| ☐ | Item | Note |
|---|------|------|
| ☐ | Address, phone, both emails | From the brief. Confirm `chakri@smarctekllc.com` is intended to be public. |
| ☐ | "SMARCTEK LLC" as a limited liability company in Connecticut | Inferred from the name and address. |
| ☐ | **Governing law: Connecticut** (Terms of Use) | An assumption. Lawyer to confirm. |
| ☐ | Privacy Policy: retention ("as long as needed"), sharing with suppliers, service providers and authorities, security statement | Draft only. **Enquiries are saved as JSON files on the server (see DEPLOYMENT.md §2)**; align policy and retention with that, or change the behaviour. |
| ☐ | Google Fonts disclosed in the Privacy Policy | True while fonts load from Google. Update if you self-host. |
| ☐ | No cookies or analytics are used | True today. If you add analytics, update the policy and add consent handling. |

## E. Deliberately **not** included (nothing was invented)

Founding year, staff names or numbers, testimonials, client logos, certifications (ISO etc.), partner or office lists, case studies of delivered projects, awards, social-media accounts (no placeholder icons or links exist), prices, quantities, delivery terms.

## F. Assets and technical notes to disclose

- **Photo quality.** The PDF's embedded images are small (equipment ~90–400 px wide; the gallery thumbnails ~140×105 px; the hero image 649×361 px). They were upscaled with Lanczos plus a light sharpen and will look soft on large or high-DPI screens. **Ask TGG for originals.**
- **No cassava-specific photos** exist in the PDF. Several gallery images show chilli on belt dryers; captions describe this accurately and four near-duplicates were held back (`show: false`).
- **Logo** was extracted from the letterhead onto a transparent background without altering the artwork; it sits on a white plate in the dark footer.
- **Stack substitution.** The brief asked for Next.js, Tailwind and Lucide. The build environment had no network access, so the site uses a TypeScript + React static generator (`tsx` + `esbuild`), hand-written CSS and an inline SVG icon set. Output is plain HTML/CSS/JS. Migrating to Next.js is possible later (components and data are separable).
- **Lighthouse.** Targets (90+/95+/95+) were **not measured**: Lighthouse could not run in this environment. Measured instead: page weight (home 24 KB gzipped HTML, 12 KB JS, 50 KB CSS, ~1 MB images in total), explicit image dimensions, hero preload, no layout overflow at 360–1440 px, and a static audit (`npm run audit`). Run Lighthouse on the live site and record the numbers.
- **Accessibility.** Built for WCAG 2.2 AA (contrast pairs computed, focus styles, skip link, labelled form with error summary, reduced-motion support, keyboard operation tested for the tabs, lightbox and nav). It has not had a manual screen-reader pass or an automated axe run. Do both before launch.
