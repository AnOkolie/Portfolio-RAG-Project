import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export const ENV = {
  PORT: process.env.PORT || 3000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  LLAMA_PARSE_KEY: process.env.LLAMA_PARSE_KEY,
  QDRANT_API_KEY: process.env.QDRANT_API_KEY,
  QDRANT_ENDPOINT: process.env.QDRANT_ENDPOINT,
  COLLECTION_NAME: process.env.COLLECTION_NAME || "PORTFOLIO_CHATBOT",
  API_KEY: process.env.API_KEY,
};
