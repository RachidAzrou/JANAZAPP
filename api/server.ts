// Geldige waarden: "nodejs" | "edge" | "experimental-edge"
export const config = { runtime: "nodejs" };

// Je bundel exporteert je server handler als ESM naar dist/index.js
import handler from "../dist/index.js";

/**
 * Vercel API handler.
 * - Werkt met Express-achtige export: (req, res) => void|Promise
 * - Kan desnoods ook een fetch(Request)->Response export doorgeven (fallback)
 */
export default async function (req: any, res: any) {
  try {
    // 1) Express/Node stijl (2 parameters)
    if (typeof handler === "function" && handler.length >= 2) {
      return handler(req, res);
    }

    // 2) Fetch-stijl (Request -> Response)
    if (typeof handler === "function" && handler.length <= 1) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers as any,
        body: req.method === "GET" || req.method === "HEAD" ? undefined : (req as any)
      });

      // @ts-ignore handler kan fetch-achtige zijn
      const response = await handler(request);

      res.status(response.status);
      response.headers.forEach((v: string, k: string) => res.setHeader(k, v));

      if (response.body) {
        const buf = Buffer.from(await response.arrayBuffer());
        res.end(buf);
      } else {
        res.end();
      }
      return;
    }

    res.status(500).json({ error: "No valid handler exported from dist/index.js" });
  } catch (err: any) {
    console.error("API error:", err);
    res.status(500).json({ error: err?.message ?? "Internal Server Error" });
  }
}
