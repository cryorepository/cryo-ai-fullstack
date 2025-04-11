import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

// Define the response interface based on the schema
interface PreRetrievalResponse {
  chatTitle?: string; // Optional, only for new chats
  ragQuery: string;
  textEmbeddingWeight: string;
  generalEmbeddingWeight: string;
}

/**
 * Prepares data for retrieval by generating a refined query and embedding weights.
 * @param userPrompt - The user's input query.
 * @param chatContext - Readable conversation history or 'new' for a new chat.
 * @returns A promise resolving to the pre-retrieval response object.
 * @throws Error if inputs are invalid or generation fails.
 */
export async function preRetrieval(userPrompt: string, chatContext: string): Promise<PreRetrievalResponse> {
  try {
    // Validate inputs
    if (!userPrompt || typeof chatContext !== 'string') {
      throw new Error("userPrompt and chatContext (string) are required");
    }

    // Define the schema with proper Schema type
    const schema: Schema = {
      description: "Details for querying a cryoprotective agent (CPA) database",
      type: SchemaType.OBJECT,
      properties: {
        ...(chatContext === 'new' && {
          chatTitle: {
            type: SchemaType.STRING,
            description: "Title of the conversation (10-20 words, e.g., 'DMSO Applications')",
            nullable: false,
          },
        }),
        ragQuery: {
          type: SchemaType.STRING,
          description: "Refined query for vector search (e.g., 'DMSO applications in cryopreservation')",
          nullable: false,
        },
        textEmbeddingWeight: {
          type: SchemaType.STRING,
          description: "Weight for textEmbedding (decimal 0-1, e.g., '0.8')",
          nullable: false,
        },
        generalEmbeddingWeight: {
          type: SchemaType.STRING,
          description: "Weight for generalEmbedding (decimal 0-1, e.g., '0.2')",
          nullable: false,
        },
      },
      required: [
        ...(chatContext === 'new' ? ['chatTitle'] : []),
        'ragQuery', // Added to match schema properties
        'textEmbeddingWeight',
        'generalEmbeddingWeight',
      ],
    };

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema, // Now correctly typed as Schema
      },
    });

    // Refined prompt
    const prompt: string = `
      Conversation History:
      ${chatContext === 'new' ? 'New Conversation' : chatContext}
      ****

      User Query: ${userPrompt}
      ****

      You are an assistant for a cryoprotective agent (CPA) database with two embedding types:
      - generalEmbedding: Structured metadata (e.g., name, synonyms, chemical formula, molecular weight, overview).
      - textEmbedding: Unstructured researcher text (e.g., full articles, use cases, toxicity details).

      Based on the user's query and conversation history (if any):
      1. Generate a concise, refined RAG query (10-20 words) to optimize vector search, focusing on key terms or synonyms that match database content (e.g., CPAs like Dimethyl Sulfoxide, Dextran, Glycerol).
      2. Determine optimal weights (decimals between 0 and 1, summing to 1) for searching these embeddings:
         - Higher generalEmbedding weight (e.g., 0.8) for factual queries (e.g., "chemical formula", "molecular weight").
         - Higher textEmbedding weight (e.g., 0.8) for contextual queries (e.g., "use cases", "toxicity", "viability").
         - Balanced weights (e.g., 0.5 each) for mixed/comparative queries (e.g., "compare Dextran and DMSO for toxicity").
      ${chatContext === 'new' ? '3. Generate a concise chat title (10-20 words) summarizing the conversation topic.' : ''}

      Return the result in JSON format matching the schema.
      Note: Irrelevant topics still require a response, so return a response like the last one if the query is not on the topic of cryoprotective agent(s) or cryopreservation.
      Examples:
      - Query: "What is DMSO's chemical formula?" → {"chatTitle": "DMSO Key Facts", "ragQuery": "DMSO chemical formula", "generalEmbeddingWeight": "0.8", "textEmbeddingWeight": "0.2"}
      - Query: "What are use cases for DMSO?" → {"chatTitle": "DMSO Applications", "ragQuery": "DMSO applications in cryopreservation", "generalEmbeddingWeight": "0.2", "textEmbeddingWeight": "0.8"}
      - Query: "Compare Dextran and DMSO for toxicity" → {"ragQuery": "Dextran and DMSO toxicity comparison", "generalEmbeddingWeight": "0.5", "textEmbeddingWeight": "0.5"}
      - Query: "What's a good chocolate-chip cookie recipe?" → {"chatTitle": "Irrelevant Query", "ragQuery": "General Chemicals", "generalEmbeddingWeight": "0.5", "textEmbeddingWeight": "0.5"}
    `;

    // Generate response
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    const jsonResponse: PreRetrievalResponse = JSON.parse(result.response.text()); // Parse the JSON string

    // Validate weights sum to 1 (with small tolerance for floating-point errors)
    const generalWeight = parseFloat(jsonResponse.generalEmbeddingWeight);
    const textWeight = parseFloat(jsonResponse.textEmbeddingWeight);
    if (Math.abs(generalWeight + textWeight - 1) > 0.01) {
      console.warn(`Weights do not sum to 1 for prompt "${userPrompt}": ${generalWeight} + ${textWeight}`);
    }

    return jsonResponse;

  } catch (error) {
    console.error("Error in preRetrieval:", error);
    throw error; // Re-throw for upstream handling
  }
}