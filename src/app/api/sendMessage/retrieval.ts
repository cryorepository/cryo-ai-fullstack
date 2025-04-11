import { GoogleGenerativeAI, EmbedContentRequest, TaskType } from "@google/generative-ai";
import VectorDB from "../schemas/aiDB/vectorDB"; // Adjust path

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

// Define types for the vector search results
interface ArticleMetadata {
  hash: string;
  name: string;
  tags: string[];
}

interface SimilarityResult {
  article: ArticleMetadata;
  similarity: number;
  details: {
    generalSimilarity: number;
    textSimilarity: number;
    generalWeight: number;
    textWeight: number;
  };
}

interface VectorSearchResponse {
  query: string;
  results: SimilarityResult[];
  weights: { generalWeight: number; textWeight: number };
  message?: string;
}

// Define the VectorDB document type (adjust based on your schema)
interface VectorDBDocument {
  generalEmbedding: number[];
  textEmbedding: number[];
  metadata: ArticleMetadata;
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vector lengths must match for cosine similarity");
  }
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0; // Avoid division by zero
}

// Function to generate embedding for the query
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    // Explicitly type the request as EmbedContentRequest with required 'role'
    const request: EmbedContentRequest = {
      content: {
        parts: [{ text }],
        role: "user", // Added required role property
      },
      taskType: TaskType.RETRIEVAL_QUERY, // Use TaskType enum
    };
    
    const result = await model.embedContent(request);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating query embedding:", error);
    throw error;
  }
}

/**
 * Performs a dual-embedding vector search with weighted similarity scores.
 * @param query - The search query string.
 * @param options - Optional weights for general and text embeddings (default 0.5 each).
 * @returns A promise resolving to the vector search results.
 * @throws Error if inputs are invalid or search fails.
 */
export async function vectorSearch(
  query: string,
  { generalWeight = 0.5, textWeight = 0.5 }: { generalWeight?: number; textWeight?: number } = {}
): Promise<VectorSearchResponse> {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error("Query must be a non-empty string");
    }

    // Validate weights
    const totalWeight = generalWeight + textWeight;
    if (Math.abs(totalWeight - 1) > 0.01) {
      throw new Error(`Weights must sum to 1 (got generalWeight: ${generalWeight}, textWeight: ${textWeight})`);
    }

    // Step 1: Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Step 2: Fetch all stored articles with their embeddings
    const allVectorArticles = await VectorDB.find({}) as VectorDBDocument[];
    if (!allVectorArticles.length) {
      return { query, results: [], weights: { generalWeight, textWeight }, message: "No articles found in vector database" };
    }

    // Step 3: Calculate weighted similarity scores for both embeddings
    const similarityScores: SimilarityResult[] = allVectorArticles.map((article: VectorDBDocument) => {
      const generalSimilarity = cosineSimilarity(queryEmbedding, article.generalEmbedding);
      const textSimilarity = cosineSimilarity(queryEmbedding, article.textEmbedding);
      const weightedSimilarity = (generalWeight * generalSimilarity) + (textWeight * textSimilarity);

      return {
        article: {
          hash: article.metadata.hash,
          name: article.metadata.name,
          tags: article.metadata.tags,
        },
        similarity: weightedSimilarity,
        details: {
          generalSimilarity,
          textSimilarity,
          generalWeight,
          textWeight,
        },
      };
    });

    // Step 4: Sort by weighted similarity in descending order
    similarityScores.sort((a, b) => b.similarity - a.similarity);

    // Step 5: Return top 10 results
    return {
      query,
      results: similarityScores.slice(0, 10),
      weights: { generalWeight, textWeight },
    };

  } catch (error) {
    console.error("Error in vectorSearch:", error);
    throw error; // Throw instead of returning null for better upstream handling
  }
}