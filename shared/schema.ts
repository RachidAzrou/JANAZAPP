import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const citizens = pgTable("citizens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  city: text("city"),
  preferredLanguage: text("preferred_language").notNull(),
  acceptPrivacy: boolean("accept_privacy").notNull().default(false),
  type: text("type").notNull().default("burger"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  partnerType: text("partner_type").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  city: text("city"),
  description: text("description"),
  acceptPrivacy: boolean("accept_privacy").notNull().default(false),
  type: text("type").notNull().default("partner"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCitizenSchema = createInsertSchema(citizens).omit({
  id: true,
  type: true,
  createdAt: true,
}).refine(data => data.acceptPrivacy === true, {
  message: "Privacy policy must be accepted",
  path: ["acceptPrivacy"]
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  type: true,
  createdAt: true,
}).refine(data => data.acceptPrivacy === true, {
  message: "Privacy policy must be accepted",
  path: ["acceptPrivacy"]
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCitizen = z.infer<typeof insertCitizenSchema>;
export type Citizen = typeof citizens.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;
