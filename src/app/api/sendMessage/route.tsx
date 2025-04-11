import { NextResponse } from 'next/server';
import mongoose, { Document } from 'mongoose';
import { randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import UserDatabase from '../schemas/aiDB/userDB'; // Adjust path
import MainDB from '../schemas/mainDB'; // Adjust path
import { preRetrieval } from './preRetrieval'; // Adjust path
import { vectorSearch } from './retrieval'; // Adjust path
import { generation } from './generation'; // Adjust path
import { extractTopHashes } from './extractTopHashes'; // Adjust path
import { cookies } from 'next/headers';

// Define types based on your schema
interface Chat extends Document { // Extend Document to match Mongoose
  chatID: string | mongoose.Types.ObjectId;
  chatTitle: string | null;
  chatModel: string | null; // Match schema: allow null
  chatCreationDate: Date;
  chatHistory: { role: 'user' | 'assistant'; content: string; timestamp: Date }[];
}

interface User {
  email: string;
  username: string;
  chats: Chat[];
  save(): Promise<void>;
}

interface TokenPayload {
  email: string;
  username: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { prompt, chatID } = await request.json();

    // Get the JWT from cookies
    const cookieStore = await cookies(); // Synchronous
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify the JWT
    const JWT_KEY = process.env.JWT_SECRET as string;
    if (!JWT_KEY) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, JWT_KEY) as TokenPayload;
    const { email } = decoded;

    // Verify user exists
    const user = await UserDatabase.findOne({ email }) as User | null;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!prompt || prompt.length < 12 || !chatID) {
      return NextResponse.json({ error: "Both 'prompt' and 'chatID' are required." }, { status: 400 });
    }

    const objectIdRegex = /^[0-9a-f]{24}$/i;
    if (chatID !== 'new' && !objectIdRegex.test(chatID)) {
      return NextResponse.json({ error: "Invalid chat ID." }, { status: 400 });
    }

    let effectiveChatID = chatID;
    let chat: Chat | undefined;
    let readableChat = 'This is a new conversation.';
    let preRetrievalResponse;

    // Handle chatID logic
    if (chatID === 'new') {
      effectiveChatID = randomUUID();
      preRetrievalResponse = await preRetrieval(prompt, 'new');
      console.log("preRetrievalResponse for new chat:", preRetrievalResponse);
    } else {
      const userMade = await UserDatabase.findOne(
        { email, "chats.chatID": chatID },
        { "chats.$": 1 } // Return only the matching chat
      );
      if (!userMade || !userMade.chats.length) {
        return NextResponse.json({ error: `Chat with ID ${chatID} not found for user` }, { status: 404 });
      }
      chat = userMade.chats[0]; // Now compatible since Chat matches IChat

      // Convert chatHistory to human-readable format
      const formatChatHistory = (chatHistory: Chat['chatHistory']) => {
        return chatHistory
          .map(entry => {
            const date = new Date(entry.timestamp);
            const formattedTime = date.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            return `${formattedTime} - ${entry.role.toUpperCase()}: ${entry.content}`;
          })
          .join('\n');
      };

      readableChat = formatChatHistory(chat.chatHistory);
      console.log(readableChat);

      preRetrievalResponse = await preRetrieval(prompt, readableChat);
      console.log("preRetrievalResponse for existing chat:", preRetrievalResponse);
    }

    // Step 1: Do the vector search
    const vectorResponse = await vectorSearch(
      preRetrievalResponse?.ragQuery || prompt,
      {
        generalWeight: parseFloat(preRetrievalResponse?.generalEmbeddingWeight) || 0.5,
        textWeight: parseFloat(preRetrievalResponse?.textEmbeddingWeight) || 0.5,
      }
    );
    console.log("vectorResponse:", vectorResponse);

    if (!vectorResponse || !Array.isArray(vectorResponse.results)) {
      return NextResponse.json({ error: "Invalid vector response format." }, { status: 500 });
    }

    // Step 2: Extract top 3 unique hashes
    const topHashes = extractTopHashes(vectorResponse.results);
    console.log("Top hashes:", topHashes);

    // Step 3: Fetch full documents from MainDB
    const articles = await MainDB.find({ hash: { $in: topHashes } });

    // Step 4: Combine raw_text into a single string
    const combinedText = articles
      .map((doc) => {
        const metadata = [
          `Name: ${doc.name || 'Unknown'}`,
          `Chemical Formula: ${doc.chemical_formula || 'N/A'}`,
          `Molecular Formula: ${doc.molecular_formula || 'N/A'}`,
          `Molecular Weight: ${doc.molecular_weight || 'N/A'}`,
          `Optimal Concentration: ${doc.optimal_conc || 'N/A'}`,
          `Synonyms: ${doc.synonyms?.join(', ') || 'None'}`,
          `Overview: ${doc.overview || 'No overview available'}`,
          `Full Text: ${doc.raw_text || 'No full text available'}`,
        ].join('\n');
        return metadata;
      })
      .join('\n\n---\n\n');

    const response = await generation(prompt, readableChat, combinedText);

    if (chatID === 'new') {
      // New chat: Create a new chat subdocument
      const newChat: Chat = {
        chatID: new mongoose.Types.ObjectId(), // Generate ObjectId
        chatTitle: preRetrievalResponse?.chatTitle || "Untitled Chat",
        chatModel: "rag_v1", // Matches schema
        chatCreationDate: new Date(),
        chatHistory: [
          { role: 'user', content: prompt, timestamp: new Date() },
          { role: 'assistant', content: response, timestamp: new Date() },
        ],
      } as Chat; // Type assertion to satisfy Document
      user.chats.push(newChat);
      effectiveChatID = newChat.chatID.toString(); // Update effectiveChatID
    } else {
      // Existing chat: Update chatHistory
      const chatIndex = user.chats.findIndex(c => c.chatID.toString() === chatID);
      if (chatIndex === -1) {
        throw new Error("Chat not found in user document");
      }
      user.chats[chatIndex].chatHistory.push(
        { role: 'user', content: prompt, timestamp: new Date() },
        { role: 'assistant', content: response, timestamp: new Date() },
      );
    }

    // Save the updated user document
    await user.save();
    console.log(`Chat saved with ID: ${effectiveChatID}`);

    return NextResponse.json({ response, chatID: effectiveChatID }, { status: 200 });

  } catch (error) {
    console.error("Error in vector search handler:", error);
    return NextResponse.json({ error: "An error occurred during the vector search." }, { status: 500 });
  }
}