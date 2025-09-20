import { 
  type User, 
  type InsertUser, 
  type Citizen, 
  type InsertCitizen,
  type Partner,
  type InsertPartner,
  users,
  citizens,
  partners
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Citizen registration operations
  createCitizen(citizen: InsertCitizen): Promise<Citizen>;
  getCitizen(id: string): Promise<Citizen | undefined>;
  getCitizenByEmail(email: string): Promise<Citizen | undefined>;
  
  // Partner registration operations
  createPartner(partner: InsertPartner): Promise<Partner>;
  getPartner(id: string): Promise<Partner | undefined>;
  getPartnerByEmail(email: string): Promise<Partner | undefined>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Citizen operations
  async createCitizen(insertCitizen: InsertCitizen): Promise<Citizen> {
    const [citizen] = await db
      .insert(citizens)
      .values(insertCitizen)
      .returning();
    return citizen;
  }

  async getCitizen(id: string): Promise<Citizen | undefined> {
    const [citizen] = await db.select().from(citizens).where(eq(citizens.id, id));
    return citizen || undefined;
  }

  async getCitizenByEmail(email: string): Promise<Citizen | undefined> {
    const [citizen] = await db.select().from(citizens).where(eq(citizens.email, email));
    return citizen || undefined;
  }

  // Partner operations
  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db
      .insert(partners)
      .values(insertPartner)
      .returning();
    return partner;
  }

  async getPartner(id: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async getPartnerByEmail(email: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.email, email));
    return partner || undefined;
  }
}

export const storage = new DatabaseStorage();
