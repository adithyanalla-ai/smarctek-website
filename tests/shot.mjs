// Visual QA helper: node tests/shot.mjs <path> <width> <outPrefix> [sliceHeight]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const [path = "/", width = "1440", prefix = "home", slice = "1000"] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:8099";
mkdirSync("/home/claude/work/shots", { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +width, height: 900 }, deviceScaleFactor: 1, bypassCSP: true });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
await page.goto(base + path, { waitUntil: "networkidle" });
await page.addStyleTag({ content: ":root{--font-head:'Inter';--font-body:'Inter'} .reveal{opacity:1!important;transform:none!important}" });
await page.evaluate(async () => { document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")); await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
await page.waitForTimeout(600);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
await page.screenshot({ path: `/home/claude/work/shots/${prefix}-full.png`, fullPage: true });
const { default: sharp } = await import("sharp");
const n = Math.ceil(h / +slice);
for (let i = 0; i < n; i++) {
  await sharp(`/home/claude/work/shots/${prefix}-full.png`).extract({ left: 0, top: i * +slice, width: +width, height: Math.min(+slice, h - i * +slice) }).toFile(`/home/claude/work/shots/${prefix}-${i + 1}.png`);
}
console.log(`height ${h}px, ${n} slices; console errors:`, errors.filter((e) => !/fonts\.g/.test(e)));
await b.close();
