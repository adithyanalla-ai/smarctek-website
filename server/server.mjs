// SMARCTEK LLC: production server (no dependencies, Node >= 20).
//  * serves the static build in ./dist with sensible caching, compression and security headers
//  * POST /api/enquiry  -> validates, spam-checks and EMAILS the enquiry (Resend HTTP API)
//  * GET  /api/form-token -> short-lived signed token used as a time-trap
// A success response is only ever returned after the email provider has accepted the message.

import http from "node:http";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { gzip } from "node:zlib";
import { promisify } from "node:util";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize, extname, resolve } from "node:path";

const gz = promisify(gzip);
const ON_VERCEL = Boolean(process.env.VERCEL);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const env = (k, d = "") => process.env[k] ?? d;
const CFG = {
  port: Number(env("PORT", "8080")),
  host: env("HOST", "0.0.0.0"),
  secret: env("FORM_SECRET") || randomBytes(32).toString("hex"),
  trustProxy: env("TRUST_PROXY") === "1" || ON_VERCEL,
  resendKey: env("RESEND_API_KEY"),
  resendUrl: env("RESEND_API_URL", "https://api.resend.com/emails"),
  mailFrom: env("MAIL_FROM"), // e.g. "SMARCTEK Website <enquiries@smarctekllc.com>" (domain verified in Resend)
  to: env("ENQUIRY_TO", "info@smarctekllc.com"),
  turnstileSecret: env("TURNSTILE_SECRET"),
  turnstileUrl: env("TURNSTILE_VERIFY_URL", "https://challenges.cloudflare.com/turnstile/v0/siteverify"),
  perHour: Number(env("RATE_LIMIT_PER_HOUR", "5")),
  minAgeMs: Number(env("FORM_MIN_AGE_MS", "3000")),
  logDir: env("ENQUIRY_LOG_DIR", join(ROOT, "data", "enquiries")),
};
if (!env("FORM_SECRET")) console.warn("[warn] FORM_SECRET not set: using a random per-process secret (tokens reset on restart; set it for multi-instance deployments).");
// On serverless every instance needs the same signing secret, so FORM_SECRET is mandatory there.
const mailReady = () => Boolean(CFG.resendKey && CFG.mailFrom && (!ON_VERCEL || env("FORM_SECRET")));
if (!mailReady()) console.warn("[warn] RESEND_API_KEY / MAIL_FROM not set: /api/enquiry will answer 503 until email delivery is configured.");

// ------------------------------------------------------------------ static files
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".ico": "image/x-icon", ".svg": "image/svg+xml",
};
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".xml", ".txt", ".svg", ".ico"]);
const gzCache = new Map();

const SEC = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; " +
    "script-src 'self' https://challenges.cloudflare.com; connect-src 'self'; frame-src https://challenges.cloudflare.com; " +
    "base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
};

async function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath);
  if (rel.endsWith("/")) rel += "index.html";
  const file = normalize(join(DIST, rel));
  if (!file.startsWith(DIST)) return send(res, 400, "Bad request");
  let target = file;
  let status = 200;
  try {
    const s = await stat(target);
    if (s.isDirectory()) {
      // /products -> /products/
      res.writeHead(301, { Location: urlPath + "/" });
      return res.end();
    }
  } catch {
    target = join(DIST, "404.html");
    status = 404;
  }
  let body;
  try {
    body = await readFile(target);
  } catch {
    return send(res, 404, "Not found");
  }
  const ext = extname(target);
  const headers = { ...SEC, "Content-Type": MIME[ext] ?? "application/octet-stream", Vary: "Accept-Encoding" };
  if (ext === ".html") headers["Cache-Control"] = "no-cache";
  else if (/[?&]v=/.test(req.url)) headers["Cache-Control"] = "public, max-age=31536000, immutable";
  else if ([".webp", ".png", ".jpg", ".ico"].includes(ext)) headers["Cache-Control"] = "public, max-age=2592000";
  else headers["Cache-Control"] = "public, max-age=3600";
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "") && body.length > 800) {
    const key = target + ":" + body.length;
    if (!gzCache.has(key)) gzCache.set(key, await gz(body));
    body = gzCache.get(key);
    headers["Content-Encoding"] = "gzip";
  }
  headers["Content-Length"] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === "HEAD" ? undefined : body);
}

function send(res, code, text, type = "text/plain; charset=utf-8", extra = {}) {
  res.writeHead(code, { ...SEC, "Content-Type": type, ...extra });
  res.end(text);
}
export const json = (res, code, obj) => send(res, code, JSON.stringify(obj), "application/json", { "Cache-Control": "no-store" });

// ------------------------------------------------------------------ helpers
const sign = (t) => createHmac("sha256", CFG.secret).update(String(t)).digest("hex").slice(0, 32);
export const makeToken = () => {
  const t = Date.now();
  return `${t}.${sign(t)}`;
};
function checkToken(tok) {
  const [t, s] = String(tok ?? "").split(".");
  if (!t || !s || !/^\d+$/.test(t)) return "missing";
  const a = Buffer.from(s), b = Buffer.from(sign(t));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "invalid";
  const age = Date.now() - Number(t);
  if (age < CFG.minAgeMs) return "too-fast";
  if (age > 2 * 60 * 60 * 1000) return "expired";
  return "ok";
}

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  if (arr.length >= CFG.perHour) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) if (!v.some((t) => now - t < 3600_000)) hits.delete(k);
}, 600_000).unref();

const clientIp = (req) => (CFG.trustProxy ? String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim() : "") || req.socket.remoteAddress || "unknown";
const clean = (v, max = 200) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
const oneLine = (v, max = 200) => clean(v, max).replace(/[\r\n]+/g, " ");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Total attachment budget. Vercel functions reject request bodies over ~4.5 MB, so default to 4 MB there.
const MB = 1024 * 1024;
const MAX_TOTAL = Number(env("MAX_TOTAL_UPLOAD_MB", ON_VERCEL ? "4" : "15")) * MB;
const MAX_FILE = Math.min(5 * MB, MAX_TOTAL);
const MAX_BODY = MAX_TOTAL + 256 * 1024;
const limitText = () => `limit ${Math.round((MAX_FILE / MB) * 10) / 10} MB per file and ${Math.round((MAX_TOTAL / MB) * 10) / 10} MB in total, up to 3 files`;
const MAGIC = {
  pdf: (b) => b.subarray(0, 4).toString() === "%PDF",
  png: (b) => b.subarray(1, 4).toString() === "PNG",
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8,
  jpeg: (b) => b[0] === 0xff && b[1] === 0xd8,
  zip: (b) => b[0] === 0x50 && b[1] === 0x4b,
  docx: (b) => b[0] === 0x50 && b[1] === 0x4b,
  xlsx: (b) => b[0] === 0x50 && b[1] === 0x4b,
  doc: (b) => b[0] === 0xd0 && b[1] === 0xcf,
  xls: (b) => b[0] === 0xd0 && b[1] === 0xcf,
};

async function parseForm(req) {
  const len = Number(req.headers["content-length"] ?? 0);
  if (len > MAX_BODY) throw Object.assign(new Error("too large"), { code: 413 });
  let seen = 0;
  const web = new ReadableStream({
    start(ctrl) {
      req.on("data", (c) => {
        seen += c.length;
        if (seen > MAX_BODY) {
          ctrl.error(Object.assign(new Error("too large"), { code: 413 }));
          req.destroy();
        } else ctrl.enqueue(new Uint8Array(c));
      });
      req.on("end", () => ctrl.close());
      req.on("error", (e) => ctrl.error(e));
    },
  });
  const r = new Request("http://local/", { method: "POST", headers: { "content-type": req.headers["content-type"] ?? "" }, body: web, duplex: "half" });
  return r.formData();
}

function validate(fd) {
  const f = (k) => clean(fd.get(k));
  const errors = {};
  const v = {
    fullName: f("fullName"), company: f("company"), email: f("email").toLowerCase(), phone: f("phone"),
    country: f("country"), industry: f("industry"), capacity: f("capacity"), location: f("location"),
    timeline: f("timeline"), description: clean(fd.get("description"), 4000),
    equipment: fd.getAll("equipment").map((x) => oneLine(x, 160)).filter(Boolean).slice(0, 60),
  };
  if (v.fullName.length < 2) errors.fullName = "Enter your full name.";
  if (v.company.length < 2) errors.company = "Enter your company name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) errors.email = "Enter a valid business email address.";
  if (v.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number including the country code.";
  if (!v.country) errors.country = "Select your country.";
  if (!v.industry) errors.industry = "Select your industry.";
  if (!v.equipment.length) errors.equipment = "Select at least one machine or solution.";
  if (v.description.length < 20) errors.description = "Describe your project in at least 20 characters.";
  if (fd.get("consent") !== "yes") errors.consent = "Please confirm the privacy consent.";

  const files = fd.getAll("attachments").filter((x) => typeof x === "object" && x.size > 0);
  if (files.length > 3) errors.attachments = "Attach no more than 3 files.";
  return { v, errors, files };
}

async function verifyTurnstile(token, ip) {
  if (!CFG.turnstileSecret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: CFG.turnstileSecret, response: String(token), remoteip: ip });
    const r = await fetch(CFG.turnstileUrl, { method: "POST", body });
    return Boolean((await r.json()).success);
  } catch {
    return false;
  }
}

function composeMail(v, files) {
  const rows = [
    ["Name", v.fullName], ["Company", v.company], ["Email", v.email], ["Phone", v.phone], ["Country", v.country],
    ["Industry", v.industry], ["Equipment / solutions", v.equipment.join("; ")], ["Required capacity", v.capacity || "—"],
    ["Project location", v.location || "—"], ["Timeline", v.timeline || "—"],
    ["Attachments", files.length ? files.map((f) => f.name).join(", ") : "none"],
  ];
  const text = rows.map(([k, val]) => `${k}: ${val}`).join("\n") + `\n\nProject description:\n${v.description}\n`;
  const html =
    `<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    rows.map(([k, val]) => `<tr><td style="border-bottom:1px solid #ddd;color:#555;vertical-align:top"><b>${esc(k)}</b></td><td style="border-bottom:1px solid #ddd">${esc(val)}</td></tr>`).join("") +
    `</table><h3 style="font-family:Arial,sans-serif">Project description</h3><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(v.description)}</p>`;
  return { text, html };
}

async function logEnquiry(status, v, files, extra = {}) {
  if (ON_VERCEL) {
    // Read-only filesystem: successful enquiries are in the email; failed ones go to the function logs so they can be recovered.
    if (status !== "sent") console.error("[enquiry]", JSON.stringify({ status, receivedAt: new Date().toISOString(), ...v, attachmentNames: files.map((f) => f.name), ...extra }));
    return;
  }
  try {
    await mkdir(CFG.logDir, { recursive: true });
    const name = `${new Date().toISOString().replace(/[:.]/g, "-")}-${status}-${randomBytes(3).toString("hex")}.json`;
    await writeFile(join(CFG.logDir, name), JSON.stringify({ status, receivedAt: new Date().toISOString(), ...v, attachmentNames: files.map((f) => f.name), ...extra }, null, 2));
  } catch (e) {
    console.error("[log] could not write enquiry log:", e.message);
  }
}

// ------------------------------------------------------------------ /api/enquiry
export async function handleEnquiry(req, res) {
  const wantsJson = /application\/json/.test(req.headers.accept ?? "");
  const reply = (code, obj) =>
    wantsJson
      ? json(res, code, obj)
      : send(res, code, `<!doctype html><meta charset="utf-8"><title>Enquiry</title><body style="font-family:system-ui;max-width:560px;margin:80px auto;padding:0 20px"><h1>${obj.ok ? "Thank you" : "Not sent"}</h1><p>${esc(obj.message ?? (obj.ok ? "Your enquiry has been sent." : "Please go back and check the form."))}</p><p><a href="/">Back to the website</a></p>`, "text/html; charset=utf-8");

  if (!mailReady()) return reply(503, { ok: false, error: "delivery_not_configured", message: "The enquiry service is not available right now." });
  const ip = clientIp(req);
  if (limited(ip)) return reply(429, { ok: false, error: "rate_limited", message: "Too many enquiries from this connection. Please try again later." });

  let fd;
  try {
    fd = await parseForm(req);
  } catch (e) {
    return reply(e.code === 413 ? 413 : 400, { ok: false, message: e.code === 413 ? `The attachments are too large (${limitText()}).` : "The submission could not be read." });
  }

  if (clean(fd.get("website"))) return reply(400, { ok: false, message: "Submission rejected." }); // honeypot
  const tk = checkToken(fd.get("formToken"));
  if (tk !== "ok") return reply(400, { ok: false, error: "token_" + tk, message: tk === "too-fast" ? "That was very quick. Please wait a moment and send again." : "Please reload the page and try again." });
  if (!(await verifyTurnstile(fd.get("cf-turnstile-response"), ip))) return reply(400, { ok: false, message: "Bot check failed. Please reload the page and try again." });

  const { v, errors, files } = validate(fd);
  const attachments = [];
  for (const f of files.slice(0, 3)) {
    const ext = extname(f.name).slice(1).toLowerCase();
    if (!MAGIC[ext]) { errors.attachments = `${f.name} is not an accepted file type.`; break; }
    if (f.size > MAX_FILE) { errors.attachments = `${f.name} is larger than ${Math.round((MAX_FILE / MB) * 10) / 10} MB.`; break; }
    const buf = Buffer.from(await f.arrayBuffer());
    if (!MAGIC[ext](buf)) { errors.attachments = `${f.name} does not look like a valid .${ext} file.`; break; }
    attachments.push({ filename: oneLine(f.name, 120).replace(/[\\/]/g, "_"), content: buf.toString("base64") });
  }
  if (Object.keys(errors).length) return reply(400, { ok: false, errors });

  const { text, html } = composeMail(v, files);
  let r;
  try {
    r = await fetch(CFG.resendUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${CFG.resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CFG.mailFrom,
        to: [CFG.to],
        reply_to: v.email,
        subject: `Website enquiry: ${oneLine(v.company, 80)} (${oneLine(v.country, 60)})`,
        text, html, attachments,
      }),
    });
  } catch (e) {
    await logEnquiry("delivery-failed", v, files, { error: e.message });
    return reply(502, { ok: false, message: "We could not send your enquiry." });
  }
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    console.error("[mail] provider rejected message:", r.status, detail.slice(0, 300));
    await logEnquiry("delivery-failed", v, files, { providerStatus: r.status });
    return reply(502, { ok: false, message: "We could not send your enquiry." });
  }
  await logEnquiry("sent", v, files);
  return reply(200, { ok: true });
}

// ------------------------------------------------------------------ router
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    if (url.pathname === "/api/form-token" && req.method === "GET") return json(res, 200, { token: makeToken() });
    if (url.pathname === "/api/health") return json(res, 200, { ok: true, mail: mailReady() });
    if (url.pathname === "/api/enquiry") {
      if (req.method !== "POST") return send(res, 405, "Method not allowed", "text/plain", { Allow: "POST" });
      return await handleEnquiry(req, res);
    }
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed");
    return await serveStatic(req, res, url.pathname);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) send(res, 500, "Server error");
  }
});
if (isMain) server.listen(CFG.port, CFG.host, () => console.log(`SMARCTEK site on http://${CFG.host}:${CFG.port}  (mail delivery ${mailReady() ? "configured" : "NOT configured"})`));
