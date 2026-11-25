// Exercises the Vercel functions in api/ with VERCEL=1 (no Vercel account needed).
// Mounts the real handlers behind a tiny shim that mimics res.status()/res.json(). Run: node tests/vercel-api.mjs
import http from "node:http";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

if (!process.env.CHILD) {
  // re-run self in a child with VERCEL=1 so the server module sees it at import time
  const mock = http.createServer((req, res) => {
    let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => { globalThis.__got ??= []; res.writeHead(200, { "content-type": "application/json" }); res.end('{"id":"x"}'); mock.hits = (mock.hits ?? 0) + 1; mock.last = JSON.parse(b); });
  });
  await new Promise((r) => mock.listen(9102, r));
  const run = (env) => new Promise((resolveP) => {
    const c = spawn("node", ["tests/vercel-api.mjs"], { env: { ...process.env, CHILD: "1", VERCEL: "1", FORM_MIN_AGE_MS: "200", RESEND_API_URL: "http://127.0.0.1:9102/emails", ...env }, stdio: "inherit" });
    c.on("exit", (code) => resolveP(code));
  });
  const a = await run({ RESEND_API_KEY: "k", MAIL_FROM: "S <e@smarctekllc.com>", FORM_SECRET: "s3cret", MODE: "configured" });
  const b = await run({ RESEND_API_KEY: "k", MAIL_FROM: "S <e@smarctekllc.com>", MODE: "nosecret" });
  mock.close();
  process.exit(a || b ? 1 : 0);
}

const load = async (f) => (await import(pathToFileURL(resolve(f)).href)).default;
const handlers = { "/api/form-token": await load("api/form-token.mjs"), "/api/enquiry": await load("api/enquiry.mjs"), "/api/health": await load("api/health.mjs") };
const srv = http.createServer((req, res) => {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(o)); };
  const h = handlers[new URL(req.url, "http://x").pathname];
  if (!h) { res.statusCode = 404; return res.end(); }
  Promise.resolve(h(req, res)).catch((e) => { console.error(e); res.statusCode = 500; res.end(); });
});
await new Promise((r) => srv.listen(9103, r));
const B = "http://127.0.0.1:9103";
const results = []; const ok = (n, c, x = "") => { results.push(c); console.log(`${c ? "PASS" : "FAIL"}  [${process.env.MODE}] ${n}${x ? " — " + x : ""}`); };
const form = async (extra = {}, file) => {
  const { token } = await (await fetch(B + "/api/form-token")).json();
  await new Promise((r) => setTimeout(r, 350));
  const fd = new FormData();
  Object.entries({ fullName: "Test Buyer", company: "Example Ltd", email: "b@example.com", phone: "+2348012345678", country: "Nigeria", industry: "Food", equipment: "Flour Conveyor (VH-200)", description: "Need a flour line for a plant in Lagos, please advise.", consent: "yes", formToken: token, ...extra }).forEach(([k, v]) => fd.set(k, v));
  if (file) fd.set("attachments", file);
  return fetch(B + "/api/enquiry", { method: "POST", body: fd, headers: { Accept: "application/json" } });
};
const png = new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==", "base64")], { type: "image/png" });

if (process.env.MODE === "configured") {
  const h = await (await fetch(B + "/api/health")).json();
  ok("health reports mail ready", h.mail === true);
  ok("GET /api/enquiry rejected", (await fetch(B + "/api/enquiry")).status === 405);
  const r = await form({}, new File([png], "drawing.png", { type: "image/png" }));
  const j = await r.json();
  ok("valid enquiry with attachment accepted", r.status === 200 && j.ok === true, `status ${r.status}`);
  const big = new File([Buffer.concat([Buffer.from("%PDF"), Buffer.alloc(4.6 * 1024 * 1024)])], "big.pdf", { type: "application/pdf" });
  const r2 = await form({}, big);
  const j2 = await r2.json().catch(() => ({}));
  ok("attachment over the Vercel-safe limit is refused with a clear message", r2.status === 413 && /MB/.test(j2.message || ""), `status ${r2.status} ${j2.message ?? ""}`);
  const r3 = await form({ website: "spam" });
  ok("honeypot rejected", r3.status === 400);
  const r4 = await form({ email: "nope" });
  ok("validation errors returned", r4.status === 400 && Boolean((await r4.json()).errors?.email));
} else {
  const h = await (await fetch(B + "/api/health")).json();
  ok("health reports mail NOT ready without FORM_SECRET", h.mail === false);
  const r = await form();
  ok("enquiry refused (503) when FORM_SECRET missing on Vercel", r.status === 503, `status ${r.status}`);
}
srv.close();
process.exit(results.includes(false) ? 1 : 0);
