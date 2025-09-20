import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL must be set");

// Neon vereist SSL; je URL moet ?sslmode=require hebben.
// Gebruik bij voorkeur de pooled host (...-pooler....neon.tech).
export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

// Health helper
export async function dbNow() {
  const { rows } = await pool.query("select now()");
  return rows[0]?.now;
}
