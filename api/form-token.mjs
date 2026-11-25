// Vercel serverless function: GET /api/form-token
import { json, makeToken } from "../server/server.mjs";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }
  return json(res, 200, { token: makeToken() });
}
