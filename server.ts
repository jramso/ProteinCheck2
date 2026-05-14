import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // FatSecret OAuth State
  let fatSecretToken: string | null = null;
  let tokenExpiry: number = 0;

  async function getFatSecretToken() {
    const now = Date.now();
    if (fatSecretToken && now < tokenExpiry) {
      return fatSecretToken;
    }

    const clientId = process.env.FATSECRET_CLIENT_ID;
    const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("FATSECRET_CLIENT_ID or FATSECRET_CLIENT_SECRET not configured");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    
    try {
      const response = await axios.post(
        "https://oauth.fatsecret.com/connect/token",
        "grant_type=client_credentials&scope=basic",
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      fatSecretToken = response.data.access_token;
      tokenExpiry = now + response.data.expires_in * 1000 - 60000; // 1 minute buffer
      return fatSecretToken;
    } catch (error: any) {
      console.error("FatSecret Auth Error:", error.response?.data || error.message);
      throw error;
    }
  }

  // API Routes
  app.get("/api/food/search", async (req, res) => {
    try {
      const { q } = req.query;
      const token = await getFatSecretToken();
      
      const response = await axios.get("https://platform.fatsecret.com/rest/server.api", {
        params: {
          method: "foods.search",
          search_expression: q,
          format: "json",
          max_results: 10
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/food/autocomplete", async (req, res) => {
    try {
      const { q } = req.query;
      const token = await getFatSecretToken();
      
      const response = await axios.get("https://platform.fatsecret.com/rest/server.api", {
        params: {
          method: "foods.autocomplete",
          expression: q,
          format: "json"
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/food/recognize", async (req, res) => {
    try {
      const { image } = req.body; // base64 image
      const token = await getFatSecretToken();
      
      // FatSecret Food Recognition API usually expects a multipart form or specific format
      // Note: This endpoint might require specific permissions on FatSecret side
      const response = await axios.post("https://platform.fatsecret.com/rest/server.api", {
        method: "food.recognition",
        image: image,
        format: "json"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("FatSecret Recognition Error:", error.response?.data || error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
