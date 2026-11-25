// Vercel serverless function: GET /api/health (reports whether mail delivery is configured; no secrets)
export default function handler(req, res) {
  const ready = Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.FORM_SECRET);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true, mail: ready });
}
