// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// ---- Middleware (parsers, CORS, logging) ----
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {}
      }
      if (logLine.length > 200) logLine = logLine.slice(0, 199) + "…";
      log(logLine);
    }
  });

  next();
});

// ---- Routes registreren ----
await registerRoutes(app);

// ---- Global error handler (NIET opnieuw throwen) ----
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err?.status || err?.statusCode || 500;
  const payload = {
    error: err?.message || "Internal Server Error",
    code: err?.code,
    detail: err?.detail,
  };
  console.error("UNCAUGHT error:", { status, ...payload, stack: err?.stack });
  if (!res.headersSent) res.status(status).json(payload);
});

// ---- Dev vs Production behavior ----
// In Vercel Functions mag je NIET listen; exporteer alleen de handler.
// Lokaal/dev: wel listen (vite setup blijft dev-only).
const isVercel = !!process.env.VERCEL;

if (!isVercel && process.env.NODE_ENV === "development") {
  const server = await setupVite(app); // jouw setupVite returnt waarschijnlijk een http.Server
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => log(`dev server on http://localhost:${port}`));
} else if (!isVercel) {
  // production lokaal/self-host
  serveStatic(app);
  const http = await import("http");
  const server = http.createServer(app);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => log(`serving on port ${port}`));
} else {
  // Vercel (serverless): alleen statics laten serveren door Vercel; API gaat via file-based function
  // Als je SPA-routes statisch wilt: zorg dat je vercel.json rewrites hebt naar index.html (heb je al).
  serveStatic(app);
}

// Belangrijk: exporteer de Express app als default voor Vercel
export default app;
