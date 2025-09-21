import {
  type User,
  type InsertUser,
  type Citizen,
  type InsertCitizen,
  type Partner,
  type InsertPartner,
  users,
  citizens,
  partners,
} from '../shared/schema.js'; // ⬅️ belangrijk: relatieve import + .js
import { db } from './db.js';           // ⬅️ belangrijk: relatieve import + .js
import { eq } from 'drizzle-orm';

// Interface voor alle storage-operaties (handig voor testen/mocks)
export interface IStorage {
  // Users (optioneel – als je ze niet gebruikt, kun je weglaten)
  createUser(data: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Citizens
  createCitizen(data: InsertCitizen): Promise<Citizen>;
  getCitizen(id: string): Promise<Citizen | undefined>;

  // Partners
  createPartner(data: InsertPartner): Promise<Partner>;
  getPartner(id: string): Promise<Partner | undefined>;
  getPartnerByEmail(email: string): Promise<Partner | undefined>;
}

class DatabaseStorage implements IStorage {
  // ===== Users =====
  async createUser(data: InsertUser): Promise<User> {
    const [row] = await db.insert(users).values(data).returning();
    return row;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [row] = await db.select().from(users).where(eq(users.email, email));
    return row || undefined;
  }

  // ===== Citizens =====
  async createCitizen(data: InsertCitizen): Promise<Citizen> {
    const [row] = await db.insert(citizens).values(data).returning();
    return row;
  }

  async getCitizen(id: string): Promise<Citizen | undefined> {
    const [row] = await db.select().from(citizens).where(eq(citizens.id, id));
    return row || undefined;
  }

  // ===== Partners =====
  async createPartner(data: InsertPartner): Promise<Partner> {
    const [row] = await db.insert(partners).values(data).returning();
    return row;
  }

  async getPartner(id: string): Promise<Partner | undefined> {
    const [row] = await db.select().from(partners).where(eq(partners.id, id));
    return row || undefined;
  }

  async getPartnerByEmail(email: string): Promise<Partner | undefined> {
    const [row] = await db.select().from(partners).where(eq(partners.email, email));
    return row || undefined;
  }
}

export const storage: IStorage = new DatabaseStorage();
