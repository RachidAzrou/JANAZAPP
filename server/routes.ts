import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCitizenSchema, insertPartnerSchema } from "@shared/schema";
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
  // Citizen registration endpoint
  app.post("/api/citizens", async (req, res) => {
    try {
      const validationResult = insertCitizenSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }

      const citizen = await storage.createCitizen(validationResult.data);
      res.status(201).json(citizen);
    } catch (error: any) {
      console.error("Error creating citizen:", error);
      
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505' || error.constraint?.includes('email')) {
        return res.status(409).json({ 
          error: "Een burger met dit e-mailadres is al geregistreerd" 
        });
      }
      
      res.status(500).json({ 
        error: "Er is een fout opgetreden bij het registreren" 
      });
    }
  });

  // Partner registration endpoint
  app.post("/api/partners", async (req, res) => {
    try {
      const validationResult = insertPartnerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
      }

      const partner = await storage.createPartner(validationResult.data);
      res.status(201).json(partner);
    } catch (error: any) {
      console.error("Error creating partner:", error);
      
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505' || error.constraint?.includes('email')) {
        return res.status(409).json({ 
          error: "Een partner met dit e-mailadres is al geregistreerd" 
        });
      }
      
      res.status(500).json({ 
        error: "Er is een fout opgetreden bij het registreren" 
      });
    }
  });

  // Get citizen by ID (optional - for future use)
  app.get("/api/citizens/:id", async (req, res) => {
    try {
      const citizen = await storage.getCitizen(req.params.id);
      if (!citizen) {
        return res.status(404).json({ error: "Burger niet gevonden" });
      }
      res.json(citizen);
    } catch (error) {
      console.error("Error getting citizen:", error);
      res.status(500).json({ error: "Er is een fout opgetreden" });
    }
  });

  // Get partner by ID (optional - for future use)
  app.get("/api/partners/:id", async (req, res) => {
    try {
      const partner = await storage.getPartner(req.params.id);
      if (!partner) {
        return res.status(404).json({ error: "Partner niet gevonden" });
      }
      res.json(partner);
    } catch (error) {
      console.error("Error getting partner:", error);
      res.status(500).json({ error: "Er is een fout opgetreden" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
