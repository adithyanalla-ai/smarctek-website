// Vercel serverless function: POST /api/enquiry (multipart form, up to ~4 MB of attachments on Vercel)
import { handleEnquiry } from "../server/server.mjs";

// Keep the raw multipart body untouched so the shared handler can stream-parse it.
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method not allowed");
  }
  return handleEnquiry(req, res);
}
