import { QdrantClient } from "@qdrant/js-client-rest";
import { ENV } from "./env.js";

export const client = new QdrantClient({
  url: ENV.QDRANT_ENDPOINT,
  apiKey: ENV.QDRANT_API_KEY,
});
