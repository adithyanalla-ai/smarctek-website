// Static audit of dist/: links, SEO, JSON-LD, alt text, headings, forbidden content.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
const root = "dist";
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); } })(root);
const pages = files.filter((f) => f.endsWith("index.html") || f.endsWith("404.html"));
const problems = [];
const titles = new Map(), descs = new Map();
const exists = (u) => { u = u.split("#")[0].split("?")[0]; if (!u) return true; const p = join(root, u); return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, "index.html"))); };
const FORBID = [/proforma/i, /invoice/i, /\bIBAN\b/i, /\bSWIFT\b/i, /bank account/i, /\bUSD\s?\d/, /\$\s?\d{2,}/, /payment terms/i, /T\/T/, /400[\s-]?tons?\s*(per|\/|a)\s*(hour|day|h\b)/i, /400\s?(t\/h|tph|tpd|tons\/day)/i, /commissioned (plant|project) of smarctek/i, /ISO\s?9001/i, /testimonial/i, /founded in/i, /since 19|since 20/i];
for (const f of pages) {
  const h = readFileSync(f, "utf8"), rel = f.replace(root, "");
  const t = /<title>([^<]*)<\/title>/.exec(h)?.[1];
  const d = /<meta name="description" content="([^"]*)"/.exec(h)?.[1];
  if (!t) problems.push(`${rel}: no <title>`); else (titles.get(t) ?? titles.set(t, []).get(t)).push(rel);
  if (!d) problems.push(`${rel}: no meta description`); else { (descs.get(d) ?? descs.set(d, []).get(d)).push(rel); if (d.length > 175) problems.push(`${rel}: description ${d.length} chars`); }
  if (!/<link rel="canonical"/.test(h) && !rel.includes("404")) problems.push(`${rel}: no canonical`);
  if (!/<html[^>]*lang="en/.test(h)) problems.push(`${rel}: no html lang`);
  if (!/property="og:title"/.test(h) && !rel.includes("404")) problems.push(`${rel}: no og:title`);
  const h1 = (h.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) problems.push(`${rel}: ${h1} h1`);
  let last = 0; for (const m of h.matchAll(/<h([1-6])[\s>]/g)) { const n = +m[1]; if (last && n > last + 1) problems.push(`${rel}: heading jump h${last}→h${n}`); last = n; }
  for (const m of h.matchAll(/<img\b[^>]*>/g)) { if (!/\balt=/.test(m[0])) problems.push(`${rel}: img without alt ${m[0].slice(0, 80)}`); if (/\bsrc=/.test(m[0]) && (!/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0]))) problems.push(`${rel}: img missing width/height`); }
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { problems.push(`${rel}: invalid JSON-LD`); } }
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) if (!exists(m[1])) problems.push(`${rel}: broken link ${m[1]}`);
  for (const m of h.matchAll(/href="#([^"]+)"/g)) if (m[1] && !new RegExp(`id="${m[1]}"`).test(h)) problems.push(`${rel}: missing anchor #${m[1]}`);
  for (const m of h.matchAll(/<a\b[^>]*>(\s*)<\/a>/g)) problems.push(`${rel}: empty link`);
  const text = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  for (const re of FORBID) { const m = re.exec(text); if (m && !/privacy|terms/.test(rel)) problems.push(`${rel}: forbidden phrase ${re} → "${m[0]}"`); }
}
for (const [k, v] of titles) if (v.length > 1) problems.push(`duplicate title "${k}": ${v.join(", ")}`);
for (const [k, v] of descs) if (v.length > 1) problems.push(`duplicate description: ${v.join(", ")}`);
const sm = readFileSync(join(root, "sitemap.xml"), "utf8");
for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) { const u = new URL(m[1]).pathname; if (!exists(u)) problems.push(`sitemap lists missing ${u}`); }
if (!existsSync(join(root, "robots.txt"))) problems.push("no robots.txt");
console.log(`${pages.length} pages audited; ${problems.length} problems`);
problems.slice(0, 60).forEach((p) => console.log(" -", p));
process.exit(problems.length ? 1 : 0);
