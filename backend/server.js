import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { retrieveAndGenerate } from "./services/retrievalService.js";
import { ENV } from "./config/env.js";
const app = express();
app.use(cors());

const PORT = ENV.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Please include a message" });
    }
    const reply = await retrieveAndGenerate(message);
    res.json({ reply });
  } catch (e) {
    console.error("Error communicating with OpenAI:", e);
    res.status(500).json({ error: "Something went wrong with the AI server." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on port ${PORT}`);
});
