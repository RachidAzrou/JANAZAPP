export const config = { runtime: "nodejs20.x" };

// ESM import werkt ook in TS (mits "module": "ESNext" in tsconfig)
import handler from "../dist/index.js";

export default async function (req: any, res: any) {
  try {
    if (typeof handler === "function" && handler.length >= 2) {
      return handler(req, res);
    }

    res.status(500).json({ error: "No valid handler exported from dist/index.js" });
  } catch (err: any) {
    console.error("API error:", err);
    res.status(500).json({ error: err?.message ?? "Internal Server Error" });
  }
}
