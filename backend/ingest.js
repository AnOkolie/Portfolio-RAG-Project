import { PDFReader } from "@llamaindex/readers/pdf";
import { fileURLToPath } from "url";
import path from "path";
import { Document, SentenceSplitter, IngestionPipeline } from "llamaindex";
import { embedModel } from "./config/embedding.js";
import { client } from "./config/vector.js";

// 1. Points to your root/backend/ folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Steps OUT of backend (..) and INTO assets
const pdfPath = path.join(__dirname, "..", "assets", "Resume.pdf");

const reader = new PDFReader();

//reads the text content from the pdf and then combines it
const documents = await reader.loadData(pdfPath);
const resumeText = documents.map((document) => document.text).join("\n");

//create a new document and then creates the chunks
const document = new Document({
  text: resumeText,
});
const pipeline = new IngestionPipeline({
  transformations: [
    new SentenceSplitter({
      chunkSize: 256,
      chunkOverlap: 30,
    }),
    embedModel,
  ],
});

const nodes = await pipeline.run({ documents: [document] });

async function update(nodes) {
  const COLLECTION_NAME = "PORTFOLIO_CHATBOT";

  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (collection) => collection.name === COLLECTION_NAME,
    );

    if (!exists) {
      console.log(`Creating collection ${COLLECTION_NAME}`);

      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1536,
          distance: "Cosine",
        },
      });
    }

    const points = nodes.map((item, ind) => ({
      id: ind + 1,
      vector: item.embedding,
      payload: {
        text: item.getContent(),
      },
    }));

    await client.upsert(COLLECTION_NAME, {
      wait: true,
      points,
    });

    console.log(`Successfully indexed ${points.length} nodes.`);
  } catch (error) {
    console.error("Error running ingestion:", error);
    throw error;
  }
}
update(nodes);
