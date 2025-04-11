import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

/**
 * Generates a response using Gemini 1.5 Pro based on user prompt, chat history, and article data.
 * @param userPrompt - The user's input query.
 * @param chatHistory - Readable conversation history (or empty string if none).
 * @param articleData - Combined text from retrieved articles.
 * @returns A promise resolving to the generated plain-text response.
 */
export async function generation(
  userPrompt: string,
  chatHistory: string,
  articleData: string
): Promise<string> {
  try {
    // Validate inputs
    if (!userPrompt || typeof userPrompt !== 'string') {
      throw new Error("userPrompt must be a non-empty string");
    }

    // Normalize empty or undefined inputs
    const normalizedChatHistory: string = chatHistory || "No conversation history available.";
    const normalizedArticleData: string = articleData || "No external data retrieved from the database.";

    // Define the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "text/plain",
        temperature: 0.7, // Moderate creativity for balanced answers
        maxOutputTokens: 500, // Limit response length (adjust as needed)
      },
    });

    // Enhanced prompt with instructions
    const prompt: string = `
      You are an expert assistant for a cryoprotective agent (CPA) database. Your task is to provide concise, accurate, and relevant answers to user queries about CPAs (e.g., DMSO, Dextran, Glycerol) using the provided conversation history and external data from articles. If the data is insufficient, acknowledge it and provide a general answer based on typical CPA knowledge. Avoid speculation and keep responses concise, do not talk about stuff off subject.

      Conversation History:
      ${normalizedChatHistory}
      ****

      User Query:
      ${userPrompt}
      ****

      External Data (Retrieved Articles):
      ${normalizedArticleData}
      ****

      Instructions:
      - For factual queries (e.g., "chemical formula"), prioritize precise metadata.
      - For contextual queries (e.g., "use cases"), synthesize insights from the article data.
      - For comparative queries (e.g., "compare X and Y"), highlight key differences or similarities.
      - If chat history is relevant, tailor the response to its context.
    `;

    // Generate the response
    const result = await model.generateContent(prompt);
    const responseText: string = result.response.text().trim();

    // Fallback if response is empty
    if (!responseText) {
      return "Sorry, I couldn't generate a meaningful response based on the available data.";
    }

    return responseText;

  } catch (error) {
    console.error("Error in generation:", (error as Error).message);
    // Fallback response for errors
    return "An error occurred while generating the response. Please try again.";
  }
}