import { embedModel } from "../config/embedding.js";
import { client } from "../config/vector.js";
import { openai } from "../config/openAi.js";
export async function retrieveAndGenerate(message) {
  const queryEmbedding = await embedModel.getQueryEmbedding(message);

  // 2. Search Qdrant for similar document chunks
  const results = await client.query("PORTFOLIO_CHATBOT", {
    query: queryEmbedding,
    limit: 5,
    with_payload: true,
  });

  //3. Extract the retrieved text
  const context = results.points
    .map((r) => r.payload?.text)
    .filter(Boolean)
    .join("\n\n");

  if (!context) {
    return "I couldn't find relevant information to answer that question.";
  }
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
    You are Anthony's portfolio assistant.

    Your purpose is to answer questions about Anthony's
    education, technical skills, projects, and experience.

    Instructions:
    - Use the provided context as your primary source of truth.
    - Do not invent qualifications, skills, or work experience.
    - Do not claim Anthony has professional experience with
      technologies unless the context explicitly establishes it.
    - If the context does not contain enough information,
      acknowledge that you don't know.
    - Keep responses conversational, concise, and professional.
  `,
      },
      {
        role: "user",
        content: `
          Context:
          ${context}

          Question:
          ${message}
        `,
      },
    ],
  });
  // 5. Return the generated answer
  return completion.choices[0].message.content;
}
