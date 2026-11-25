/* Static site generator: renders every route with React, bundles CSS/JS with esbuild,
 * writes sitemap/robots/JSON-LD and the spec review report.   Run: npm run build  */
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build as esbuild } from "esbuild";
import { mkdirSync, rmSync, writeFileSync, cpSync, existsSync, readFileSync, statSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

import { SITE, IMAGE_SOURCE, PUBLISH_UNREVIEWED_SPECS } from "./lib/config";
import { PRODUCTS, bySlug, categoryLabel } from "./data/products";
import { SOLUTIONS, GALLERY } from "./data/content";
import { Document, type PageMeta } from "./components/Layout";
import { visibleSpecs } from "./components/blocks";
import { HomePage } from "./pages/home";
import {
  AboutPage, SolutionsIndexPage, SolutionPage, ProductsIndexPage, ProductPage, ProjectsPage,
  GlobalPage, GalleryPage, ContactPage, QuotePage, PrivacyPage, TermsPage, NotFoundPage,
} from "./pages/inner";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const warnings: string[] = [];

// ------------------------------------------------------------------ validation
function validate() {
  for (const p of PRODUCTS) {
    for (const r of p.related) if (!bySlug(r)) throw new Error(`Product ${p.slug}: unknown related slug ${r}`);
    for (const f of [p.image, ...(p.extraImages ?? []).map((i) => i.src)])
      if (!existsSync(join(ROOT, "public", f))) throw new Error(`Missing image ${f} for ${p.slug}`);
  }
  for (const s of SOLUTIONS) {
    for (const r of s.products) if (!bySlug(r)) throw new Error(`Solution ${s.slug}: unknown product ${r}`);
    if (!existsSync(join(ROOT, "public", s.image))) throw new Error(`Missing solution image ${s.image}`);
  }
  for (const g of GALLERY) if (!existsSync(join(ROOT, "public", g.src!))) throw new Error(`Missing gallery image ${g.src}`);
  if (!IMAGE_SOURCE.permissionConfirmed)
    warnings.push(`Image permission from ${IMAGE_SOURCE.owner} is NOT confirmed (src/lib/config.ts → IMAGE_SOURCE). Do not publish publicly until it is.`);
  if (!SITE.turnstileSiteKey) warnings.push("TURNSTILE_SITE_KEY not set: bot-detection widget disabled (honeypot + time token + rate limit remain).");
}

// ------------------------------------------------------------------ structured data
const abs = (p: string) => SITE.url + p;
const orgId = `${SITE.url}/#organization`;
const organization = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  name: SITE.name,
  url: SITE.url + "/",
  logo: abs("/images/brand/smarctek-logo.png"),
  slogan: SITE.tagline,
  email: SITE.email.info,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.regionCode,
    postalCode: SITE.address.postalCode,
    addressCountry: "US",
  },
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: SITE.email.info, telephone: SITE.phone, availableLanguage: ["English"] }],
});
const website = () => ({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url + "/", name: SITE.name, publisher: { "@id": orgId } });
const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

// ------------------------------------------------------------------ routes
interface Route { path: string; meta: Omit<PageMeta, "path">; el: ReactElement; sitemap?: boolean; priority?: number }

const routes: Route[] = [];
const add = (r: Route) => routes.push(r);

add({
  path: "/",
  meta: {
    title: "Industrial Machinery Solutions USA | SMARCTEK LLC",
    description: "SMARCTEK LLC, Connecticut: industrial machinery, agricultural processing systems and international equipment sourcing. Request a quote for your project.",
    jsonLd: [organization(), website()],
  },
  el: <HomePage />,
  priority: 1,
});
add({
  path: "/about-us/",
  meta: {
    title: "About SMARCTEK LLC | Industrial Equipment Business",
    description: "SMARCTEK LLC is a Connecticut-based business focused on industrial machinery, agricultural processing systems and international project opportunities.",
    jsonLd: [breadcrumb([{ name: "Home", path: "/" }, { name: "About Us", path: "/about-us/" }])],
  },
  el: <AboutPage />,
  priority: 0.7,
});
add({
  path: "/solutions/",
  meta: {
    title: "Industrial Processing Solutions | SMARCTEK LLC",
    description: "Cassava processing, agricultural equipment, flour milling, material handling, pneumatic and filtration systems, automation and packaging. Explore solutions.",
    jsonLd: [breadcrumb([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions/" }])],
  },
  el: <SolutionsIndexPage />,
  priority: 0.9,
});
for (const s of SOLUTIONS) {
  add({
    path: `/solutions/${s.slug}/`,
    meta: {
      title: s.seoTitle,
      description: s.seoDescription,
      jsonLd: [breadcrumb([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions/" }, { name: s.name, path: `/solutions/${s.slug}/` }])],
    },
    el: <SolutionPage s={s} />,
    priority: 0.8,
  });
}
add({
  path: "/products/",
  meta: {
    title: "Industrial Machinery Catalogue | SMARCTEK LLC",
    description: "Searchable catalogue of conveyors, elevators, roller mills, plansifters, filters, fans and packaging equipment for flour and agricultural processing lines.",
    jsonLd: [
      breadcrumb([{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }]),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Industrial machinery catalogue",
        itemListElement: PRODUCTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/products/${p.slug}/`), name: p.name })),
      },
    ],
  },
  el: <ProductsIndexPage />,
  priority: 0.9,
});
for (const p of PRODUCTS) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.model ? `${p.name} ${p.model}` : p.name,
    description: p.overview,
    image: abs(p.image),
    category: categoryLabel(p.category),
    ...(p.model ? { model: p.model } : {}),
    url: abs(`/products/${p.slug}/`),
    additionalProperty: visibleSpecs(p).map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
  };
  add({
    path: `/products/${p.slug}/`,
    meta: {
      title: `${p.name}${p.model ? " " + p.model : ""} | ${categoryLabel(p.category)} | SMARCTEK LLC`.slice(0, 90),
      description: `${p.short} Specifications, applications and quotation enquiry from SMARCTEK LLC.`.slice(0, 158),
      ogImage: undefined,
      ogType: "website",
      jsonLd: [ld, breadcrumb([{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }, { name: p.name, path: `/products/${p.slug}/` }])],
    },
    el: <ProductPage p={p} />,
    priority: 0.7,
  });
}
add({
  path: "/projects/",
  meta: {
    title: "Reference Project: 400-Ton Cassava Flour Line | SMARCTEK LLC",
    description: "A reference configuration for a 400-ton cassava flour processing line and irrigation processing plant: stages, equipment requirements and conceptual scope.",
    jsonLd: [breadcrumb([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects/" }])],
  },
  el: <ProjectsPage />,
  priority: 0.7,
});
add({
  path: "/global-business/",
  meta: {
    title: "International Machinery Sourcing | SMARCTEK LLC",
    description: "A USA-based contact for international equipment sourcing, collaboration enquiries and project-specific discussions on agricultural processing plants.",
    jsonLd: [breadcrumb([{ name: "Home", path: "/" }, { name: "Global Business", path: "/global-business/" }])],
  },
  el: <GlobalPage />,
  priority: 0.7,
});
add({
  path: "/gallery/",
  meta: {
    title: "Industrial Processing Gallery | SMARCTEK LLC",
    description: "Reference photographs of industrial halls, belt dryers, material handling and storage towers used in agricultural processing.",
    jsonLd: [breadcrumb([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery/" }])],
  },
  el: <GalleryPage />,
  priority: 0.5,
});
add({
  path: "/contact/",
  meta: {
    title: "Contact SMARCTEK LLC | Glastonbury, Connecticut",
    description: "Contact SMARCTEK LLC at 2389 Main Street, Glastonbury, Connecticut. Call +1 (617) 380-9644, email, or send a structured project enquiry.",
    hideMobileCta: true,
    jsonLd: [
      { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact SMARCTEK LLC", url: abs("/contact/"), about: { "@id": orgId } },
      breadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }]),
    ],
  },
  el: <ContactPage />,
  priority: 0.8,
});
add({
  path: "/request-a-quote/",
  meta: {
    title: "Request a Quote | SMARCTEK LLC",
    description: "Select machines or solutions and send one combined quotation enquiry to SMARCTEK LLC.",
    hideMobileCta: true,
    noindex: true,
  },
  el: <QuotePage />,
  sitemap: false,
});
add({
  path: "/privacy-policy/",
  meta: { title: "Privacy Policy | SMARCTEK LLC", description: "How SMARCTEK LLC collects, uses and protects information submitted through this website." },
  el: <PrivacyPage />,
  priority: 0.2,
});
add({
  path: "/terms-of-use/",
  meta: { title: "Terms of Use | SMARCTEK LLC", description: "Terms governing use of the SMARCTEK LLC website and the information on it." },
  el: <TermsPage />,
  priority: 0.2,
});

// ------------------------------------------------------------------ run
async function main() {
  validate();
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(join(DIST, "assets"), { recursive: true });
  cpSync(join(ROOT, "public"), DIST, { recursive: true });

  await esbuild({ entryPoints: [join(ROOT, "src/client/main.ts")], bundle: true, minify: true, target: "es2019", outfile: join(DIST, "assets/main.js"), legalComments: "none" });
  await esbuild({ entryPoints: [join(ROOT, "src/styles/main.css")], bundle: true, minify: true, outfile: join(DIST, "assets/site.css"), loader: { ".css": "css" }, legalComments: "none" });
  writeFileSync(join(DIST, "assets/boot.js"), `document.documentElement.className="js";`);

  const version = createHash("sha1").update(readFileSync(join(DIST, "assets/main.js"))).update(readFileSync(join(DIST, "assets/site.css"))).digest("hex").slice(0, 8);

  // intrinsic image sizes → width/height attributes (prevents layout shift)
  const { default: sharp } = await import("sharp");
  const dims = new Map<string, [number, number]>();
  const scan = async (dir: string, url: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) await scan(full, `${url}/${name}`);
      else if (/\.(webp|png|jpe?g)$/i.test(name)) {
        const m = await sharp(full).metadata();
        if (m.width && m.height) dims.set(`${url}/${name}`, [m.width, m.height]);
      }
    }
  };
  await scan(join(ROOT, "public/images"), "/images");
  const addDims = (html: string) =>
    html.replace(/<img\b[^>]*>/g, (tag) => {
      if (/\swidth=/.test(tag)) return tag;
      const src = /\ssrc="([^"]+)"/.exec(tag)?.[1];
      const d = src && dims.get(src);
      return d ? tag.replace(/^<img/, `<img width="${d[0]}" height="${d[1]}"`) : tag;
    });

  const write = (path: string, html: string) => {
    html = addDims(html);
    const file = path.endsWith(".html") ? join(DIST, path) : join(DIST, path, "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, "<!doctype html>" + html);
  };

  for (const r of routes) {
    const html = renderToStaticMarkup(<Document meta={{ ...r.meta, path: r.path }} assetVersion={version}>{r.el}</Document>);
    write(r.path, html);
  }
  write("/404.html", renderToStaticMarkup(<Document meta={{ title: "Page not found | SMARCTEK LLC", description: "Page not found.", path: "/404.html", noindex: true }} assetVersion={version}><NotFoundPage /></Document>));

  // sitemap + robots
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.filter((r) => r.sitemap !== false && !r.meta.noindex);
  writeFileSync(
    join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((r) => `  <url><loc>${SITE.url}${r.path}</loc><lastmod>${today}</lastmod><priority>${(r.priority ?? 0.5).toFixed(1)}</priority></url>`).join("\n") +
      `\n</urlset>\n`,
  );
  writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

  // docs generated from data
  writeSpecFlags();

  const sizeKB = (f: string) => Math.round(statSync(join(DIST, f)).size / 1024);
  console.log(`\nBuilt ${routes.length + 1} pages → dist/   (main.js ${sizeKB("assets/main.js")} KB, site.css ${sizeKB("assets/site.css")} KB, v${version})`);
  for (const w of warnings) console.warn("⚠  " + w);
}

function writeSpecFlags() {
  const lines: string[] = [];
  lines.push("# Specification review flags", "", "_Generated by `npm run build` from `src/data/products.ts`. Do not edit by hand._", "");
  lines.push("Source: TGG Group proforma (14 pages). Nothing below has been silently corrected. Items marked **withheld** do not appear on the public site until a technical reviewer confirms them and the `review` flag is removed from the data file (or the site is built with `PUBLISH_UNREVIEWED_SPECS=true`).", "");
  lines.push("## Global normalisations applied", "");
  lines.push("- European number formatting converted to US format: decimal commas (`5,5 Kw` → 5.5 kW) and dot thousands separators (`20.000 m³/H` → 20,000 m³/h; `8.750 – 15.000 kg/hour` → 8,750–15,000 kg/hour; `1953 lt.` → 1,953 L). **Confirm with TGG that the dot-thousands readings are correct.**");
  lines.push("- Obvious typographical slips in descriptive prose corrected (`Capasity` → capacity, `Barns` → bars). Numbers, models, materials and units are never altered.", "");
  lines.push("## Cross-document questions for engineering", "");
  lines.push("- **Wheat / corn equipment in a cassava line.** The elevators, vibro separator, roller mill, plansifter and degerminator are described for wheat, grain or corn. Confirm suitability for cassava flour.");
  lines.push("- **Capacity chain.** Flour conveyors are rated 10–15 t/h; elevators and vibro separator are rated 8 t/h (wheat) and 15 t/h. The packaging machine outputs 8.75–15 t/h. No single line capacity is stated, and the **400-ton** headline figure has no time basis. Do not publish a per-hour or per-day figure.");
  lines.push("- **Packaging machine marked `ALT`** in the source. Confirm whether it is part of the quoted line or an alternative.");
  lines.push("- **Drying unit (B1) and washing unit (A1)** are listed as 'complete' with no equipment itemised. The site says scope is defined per project.");
  lines.push("- **Item name translations:** 'Eklüs' (shown as *Air Lock Feeder (Eklüs)*), 'Vibro Tarar' (treated as the same RT-100 as 'Vibro Separator'), 'ruseym' (germ).");
  lines.push("- **Quantities** per item (e.g. 6 blower pumps, 4 roller mills) are deliberately not published.", "");
  lines.push("## Per product", "");
  for (const p of PRODUCTS) {
    const held = p.specs.filter((s) => s.review);
    if (!held.length && !(p.flags && p.flags.length)) continue;
    lines.push(`### ${p.name}${p.model ? ` (${p.model})` : ""}  \`${p.slug}\`  — PDF ${p.pdfRef}`, "");
    for (const s of held) lines.push(`- **Withheld · ${s.label}:** ${s.review}`);
    for (const f of p.flags ?? []) lines.push(`- ${f}`);
    lines.push("");
  }
  const out = join(ROOT, "docs/SPEC_REVIEW_FLAGS.md");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, lines.join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); });
