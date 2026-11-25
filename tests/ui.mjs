// UI behaviour tests against a running server (BASE, default http://localhost:8099).
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://localhost:8099";
const res = [];
const ok = (n, c, x = "") => { res.push(c); console.log(`${c ? "PASS" : "FAIL"}  ${n}${x ? " — " + x : ""}`); };
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
const page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());

// catalogue filter + search
await page.goto(BASE + "/products/");
const visible = () => page.locator(".pcard:visible").count();
const all = await visible();
ok("catalogue shows 19 products", all === 19, `${all}`);
await page.click('[data-filter="pneumatic"], .chip:has-text("Pneumatic")');
const pn = await visible(); ok("category filter narrows list", pn > 0 && pn < all, `${pn}`);
await page.click('.chip:has-text("All")');
await page.fill('input[type="search"]', "plansifter");
await page.waitForTimeout(200);
const s = await visible(); ok("search finds plansifter", s >= 1 && s < 5, `${s}`);
await page.fill('input[type="search"]', "zzzz");
await page.waitForTimeout(200);
ok("empty state on no match", (await visible()) === 0 && (await page.locator("[data-empty]:visible, .catalogue__empty:visible").count()) >= 1);

// quote shortlist
await page.goto(BASE + "/products/flour-conveyor-vh-200/");
await page.click('a[data-quote-add="flour-conveyor-vh-200"].btn--lg');
await page.waitForTimeout(200);
const cnt = await page.locator("[data-quote-count]").first().textContent();
ok("add to quote list updates counter", /1/.test(cnt || ""), cnt?.trim());
await page.goto(BASE + "/request-a-quote/");
await page.waitForTimeout(400);
ok("shortlist persists to quote form", (await page.locator('input[name="equipment"]:checked').count()) === 1);

// home: process flow, lightbox
await page.goto(BASE + "/");
const tabs = page.locator('[role="tab"]');
if (await tabs.count()) {
  await tabs.nth(0).focus(); await page.keyboard.press("ArrowRight");
  ok("process flow arrow-key navigation", (await tabs.nth(1).getAttribute("aria-selected")) === "true");
} else {
  const btns = page.locator(".flow button, .process button");
  await btns.nth(2).click(); ok("process flow stage selectable", (await btns.nth(2).getAttribute("aria-expanded")) === "true" || (await btns.nth(2).getAttribute("aria-selected")) === "true");
}
await page.locator("a[data-lightbox]").first().click();
await page.waitForTimeout(300);
ok("lightbox opens", await page.locator("dialog[open]").count() === 1);
await page.keyboard.press("Escape");
ok("lightbox closes on Escape", (await page.locator("dialog[open]").count()) === 0);
ok("no JS errors", errs.length === 0, errs.join("|"));

// responsive overflow
for (const w of [360, 390, 768, 1024, 1440]) {
  const p = await ctx.newPage(); await p.setViewportSize({ width: w, height: 900 });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  for (const path of ["/", "/products/", "/products/degerminator/", "/solutions/cassava-processing/", "/contact/", "/request-a-quote/", "/gallery/", "/global-business/", "/projects/", "/about-us/"]) {
    await p.goto(BASE + path, { waitUntil: "load" });
    const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > 1) ok(`no horizontal overflow ${w}px ${path}`, false, `+${o}px`);
  }
  await p.close();
}
ok("responsive overflow sweep complete", true);

// mobile nav
const m = await ctx.newPage(); await m.setViewportSize({ width: 390, height: 800 });
await m.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
await m.goto(BASE + "/");
await m.click(".nav-toggle"); await m.waitForTimeout(300);
ok("mobile nav opens", await m.locator("#primary-nav a:visible, nav a:visible").count() >= 6);
await b.close();
const f = res.filter((x) => !x).length; console.log(`\n${res.length - f}/${res.length} passed`); process.exit(f ? 1 : 0);
