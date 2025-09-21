import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "client");

export default defineConfig(async ({ mode }) => {
  const isProd = mode === "production";

  const plugins = [react(), runtimeErrorOverlay()];

  // Alleen in Replit + niet in production
  if (!isProd && process.env.REPL_ID) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    plugins,
    root: ROOT,
    resolve: {
      alias: {
        "@": path.resolve(ROOT, "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
      // voorkomt dubbele React copies
      dedupe: ["react", "react-dom"],
    },
    build: {
      // build één niveau omhoog, naar project-root/dist
      outDir: path.resolve(ROOT, "../dist"),
      emptyOutDir: true,
    },
    optimizeDeps: {
      // helpt bij Radix-resolutie in CI
      include: ["@radix-ui/react-tooltip"],
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
