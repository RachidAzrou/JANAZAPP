// api/[...route].ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// registreer routes zonder /api-prefix (zie routes.ts)
await registerRoutes(app);

// generieke error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("API ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Rewrite stuurt /api/* → function; strip /api zodat /citizens routes matchen
  if (req.url) req.url = req.url.replace(/^\/api(\/|$)/, "/");
  // @ts-ignore (compat express ↔ vercel)
  return app(req, res);
}
