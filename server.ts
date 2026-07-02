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
          max_results: 10,
          region: "BR",
          language: "pt"
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
          format: "json",
          region: "BR",
          language: "pt"
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

  function getLocalFallbackUrl(term: string): string {
    const t = term.toLowerCase();
    if (t.includes("ovo") || t.includes("egg") || t.includes("omelete") || t.includes("clara")) {
      return "https://images.pexels.com/photos/162712/egg-yellow-food-one-162712.jpeg?auto=compress&cs=tinysrgb&h=350";
    }
    if (t.includes("carne") || t.includes("frango") || t.includes("bife") || t.includes("meat") || t.includes("chicken") || t.includes("porco") || t.includes("peixe") || t.includes("fish")) {
      return "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&h=350";
    }
    if (t.includes("whey") || t.includes("shake") || t.includes("leite") || t.includes("suco") || t.includes("vitamina") || t.includes("juice") || t.includes("milk") || t.includes("bebida")) {
      return "https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&h=350";
    }
    if (t.includes("salada") || t.includes("alface") || t.includes("tomate") || t.includes("vegetal") || t.includes("legume") || t.includes("salad") || t.includes("folha")) {
      return "https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&h=350";
    }
    return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350";
  }

  app.get("/api/images/search", async (req, res) => {
    try {
      const { q } = req.query;
      const apiKey = process.env.PEXELS_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          success: false,
          imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350",
          reason: "API_KEY_NOT_CONFIGURED"
        });
      }

      if (!q || typeof q !== 'string') {
        return res.status(200).json({
          success: false,
          imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350",
          reason: "EMPTY_QUERY"
        });
      }

      const cleaned = q
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\b(com|de|e|para|da|do|em|um|uma|dois|tres|comida|alimento)\b/gi, "")
        .trim();

      const searchTerms = `${cleaned} food`.trim();

      try {
        const response = await axios.get("https://api.pexels.com/v1/search", {
          params: {
            query: searchTerms,
            per_page: 5,
            orientation: "square"
          },
          headers: {
            Authorization: apiKey
          }
        });

        const photos = response.data.photos;
        if (photos && photos.length > 0) {
          const imageUrl = photos[0].src.medium || photos[0].src.large || photos[0].src.original;
          return res.json({
            success: true,
            query: q,
            imageUrl
          });
        }

        const firstWord = cleaned.split(/\s+/)[0];
        if (firstWord && firstWord !== cleaned) {
          const fallbackResponse = await axios.get("https://api.pexels.com/v1/search", {
            params: {
              query: `${firstWord} food`,
              per_page: 3,
              orientation: "square"
            },
            headers: {
              Authorization: apiKey
            }
          });

          const fallbackPhotos = fallbackResponse.data.photos;
          if (fallbackPhotos && fallbackPhotos.length > 0) {
            const imageUrl = fallbackPhotos[0].src.medium || fallbackPhotos[0].src.large || fallbackPhotos[0].src.original;
            return res.json({
              success: true,
              query: q,
              imageUrl
            });
          }
        }

        const localFallback = getLocalFallbackUrl(cleaned);
        return res.json({
          success: false,
          query: q,
          imageUrl: localFallback,
          reason: "NO_RESULTS"
        });

      } catch (apiError: any) {
        console.error("Pexels API Direct Error:", apiError.response?.data || apiError.message);
        const localFallback = getLocalFallbackUrl(cleaned);
        return res.json({
          success: false,
          query: q,
          imageUrl: localFallback,
          reason: "API_ERROR",
          message: apiError.message
        });
      }

    } catch (error: any) {
      console.error("Image Search Controller Error:", error.message);
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
