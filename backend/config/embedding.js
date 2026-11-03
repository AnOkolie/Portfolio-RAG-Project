import { OpenAIEmbedding } from "@llamaindex/openai";
import { ENV } from "./env.js";
//generating the embedding
export const embedModel = new OpenAIEmbedding({
  model: "text-embedding-3-small",
  apiKey: ENV.OPENAI_API_KEY,
});
