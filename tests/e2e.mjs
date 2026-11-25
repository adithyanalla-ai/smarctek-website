// End-to-end enquiry tests. Run after `npm run build`:  node tests/e2e.mjs
// Starts a mock Resend API + two real server instances (configured / unconfigured) and drives the form in Chromium.
import http from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const results = [];
const check = (name, ok, extra = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
};

// ---- mock mail provider
const received = [];
let mockMode = "ok";
const mock = http.createServer((req, res) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    if (mockMode === "fail") {
      res.writeHead(500, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "boom" }));
    }
    received.push({ auth: req.headers.authorization, body: JSON.parse(b) });
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ id: "mock-1" }));
  });
});
await new Promise((r) => mock.listen(9101, r));

const logDir = mkdtempSync(join(tmpdir(), "enq-"));
const start = (port, extra) => {
  const p = spawn("node", ["server/server.mjs"], {
    env: { ...process.env, PORT: String(port), FORM_SECRET: "test-secret", FORM_MIN_AGE_MS: "300", ENQUIRY_LOG_DIR: logDir, ...extra },
    stdio: "ignore",
  });
  return p;
};
const good = start(8111, { RESEND_API_KEY: "re_test", RESEND_API_URL: "http://127.0.0.1:9101/emails", MAIL_FROM: "Smarctek <enquiries@smarctekllc.com>", ENQUIRY_TO: "info@smarctekllc.com" });
const bad = start(8112, {});
await new Promise((r) => setTimeout(r, 1200));

const png = join(mkdtempSync(join(tmpdir(), "att-")), "drawing.png");
writeFileSync(png, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==", "base64"));

const browser = await chromium.launch();
const fill = async (page) => {
  await page.fill('form [name="fullName"]', "Test Buyer");
  await page.fill('form [name="company"]', "Example Foods Ltd");
  await page.fill('form [name="email"]', "buyer@example.com");
  await page.fill('form [name="phone"]', "+234 801 234 5678");
  await page.selectOption('form [name="country"]', { index: 1 });
  await page.selectOption('form [name="industry"]', { index: 1 });
  await page.fill('form [name="description"]', "We need a flour line for a plant in Lagos; please advise on options.");
  await page.check('form [name="consent"]');
};

try {
  // 1. validation (no network)
  {
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:8111/request-a-quote/");
    await page.click("[data-submit]");
    const summary = page.locator("[data-error-summary]");
    check("empty submit shows error summary", await summary.isVisible());
    check("error summary lists multiple items", (await summary.locator("li").count()) >= 6);
    check("no request sent on invalid form", received.length === 0);
    await page.close();
  }

  // 2. success path with seeded equipment + attachment
  {
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:8111/request-a-quote/?add=flour-conveyor-vh-200");
    await page.waitForTimeout(600);
    await fill(page);
    check("?add= pre-selects equipment", (await page.locator('input[name="equipment"]:checked').count()) >= 1);
    await page.setInputFiles('form [name="attachments"]', png);
    await page.click("[data-submit]");
    await page.waitForSelector(".form__done", { timeout: 8000 });
    check("success message shown after provider accepts", true);
    const mail = received.at(-1);
    check("provider called with API key", mail?.auth === "Bearer re_test");
    check("routed to info@smarctekllc.com", JSON.stringify(mail?.body?.to).includes("info@smarctekllc.com"));
    check("reply_to is the submitter", JSON.stringify(mail?.body?.reply_to ?? mail?.body?.replyTo).includes("buyer@example.com"));
    check("attachment forwarded", (mail?.body?.attachments?.length ?? 0) === 1);
    check("equipment named in message", JSON.stringify(mail?.body).toLowerCase().includes("flour conveyor"));
    await page.close();
  }

  // 3. provider failure must NOT show success
  {
    mockMode = "fail";
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:8111/request-a-quote/?add=flour-conveyor-vh-200");
    await page.waitForTimeout(600);
    await fill(page);
    await page.click("[data-submit]");
    await page.waitForSelector(".form__status--error", { timeout: 8000 });
    check("provider failure shows error, not success", (await page.locator(".form__done").count()) === 0);
    await page.close();
    mockMode = "ok";
  }

  // 4. unconfigured server must NOT simulate success
  {
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:8112/request-a-quote/?add=flour-conveyor-vh-200");
    await page.waitForTimeout(600);
    await fill(page);
    await page.click("[data-submit]");
    await page.waitForSelector(".form__status--error", { timeout: 8000 });
    check("unconfigured mail shows error (no fake success)", (await page.locator(".form__done").count()) === 0);
    await page.close();
  }

  // 5. bot protection (direct API)
  {
    const t = await (await fetch("http://127.0.0.1:8111/api/form-token")).json();
    const mk = (extra = {}, token = t.token) => {
      const fd = new FormData();
      Object.entries({ fullName: "Bot", company: "Spam", email: "b@example.com", phone: "1234567890", country: "X", industry: "Y", equipment: "p:flour-conveyor-vh-200", description: "x".repeat(40), consent: "yes", formToken: token, ...extra }).forEach(([k, v]) => fd.set(k, v));
      return fd;
    };
    const before = received.length;
    const r1 = await fetch("http://127.0.0.1:8111/api/enquiry", { method: "POST", body: mk() });
    check("token submitted too fast is rejected", r1.status >= 400 && received.length === before, `status ${r1.status}`);
    await new Promise((r) => setTimeout(r, 500));
    const r2 = await fetch("http://127.0.0.1:8111/api/enquiry", { method: "POST", body: mk({ website: "http://spam" }) });
    check("honeypot submission sends no email", received.length === before, `status ${r2.status}`);
    const r3 = await fetch("http://127.0.0.1:8111/api/enquiry", { method: "POST", body: mk({}, "forged.token") });
    check("forged token rejected", r3.status >= 400 && received.length === before, `status ${r3.status}`);
  }
} finally {
  await browser.close();
  good.kill();
  bad.kill();
  mock.close();
}
const failed = results.filter((x) => !x).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
