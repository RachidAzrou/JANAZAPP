// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// ---------- Middleware ----------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// simpele API logger
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJson: unknown;

  const originalJson = res.json.bind(res);
  res.json = ((body: any, ...args: any[]) => {
    capturedJson = body;
    return originalJson(body, ...args);
  }) as any;

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const ms = Date.now() - start;
      let line = `${req.method} ${req.path} ${res.statusCode} in ${ms}ms`;
      if (capturedJson !== undefined) {
        try {
          const s = JSON.stringify(capturedJson);
          line += ` :: ${s.length > 300 ? s.slice(0, 299) + "…" : s}`;
        } catch {}
      }
      log(line);
    }
  });

  next();
});

// ---------- Routes registreren ----------
const server = await registerRoutes(app); // jouw functie retourneert een http.Server

// ---------- Global error handler (NIET opnieuw throwen) ----------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.status || err?.statusCode || 500;
  const payload =
    process.env.EXPOSE_ERRORS
      ? { error: err?.message || "Internal Server Error", code: err?.code, detail: err?.detail, stack: err?.stack }
      : { error: err?.message || "Internal Server Error" };

  console.error("UNCAUGHT error:", { status, ...payload });
  if (!res.headersSent) res.status(status).json(payload);
});

// ---------- Runtime gedrag ----------
// In Vercel (serverless) mag je NIET listen; exporteer alleen de app.
// Lokaal/dev: wel listen. "serveStatic" alleen buiten dev (Vite dev server regelt assets).
const isVercel = !!process.env.VERCEL;

if (!isVercel && app.get("env") === "development") {
  await setupVite(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => log(`dev server on http://localhost:${port}`));
} else if (!isVercel) {
  serveStatic(app);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => log(`serving on port ${port}`));
} else {
  // Vercel serverless: statics laat je door Vercel bedienen; API via file-based function
  serveStatic(app);
}

// Heel belangrijk voor Vercel: exporteer de Express app als DEFAULT
export default app;
