"use client";
/*

import { useState, useEffect } from "react";
import { AiTextbox } from "@/components/textbox-component";
import { MessageHandler } from "@/components/chat/message-handler";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

// Define the chat message interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  _id: string;
}

// Define props interface for the component
interface ChatHandlerProps {
  chatId: string;
}

// Interface for fetched chat data
interface ArticleData {
  chatID: string;
  chatTitle?: string;
  chatHistory: { role: "user" | "assistant"; content: string; timestamp: string; _id: string }[];
}

// Fetch chat data from the server
async function getChatData(chatID: string): Promise<ArticleData | null> {
  try {
    const res = await fetch(`http://localhost:3001/fetchChat/${chatID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.log(`Fetch failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    console.log("Fetched chat data:", data);
    return data as ArticleData;
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return null;
  }
}

// Send a message to the server
async function sendMessage(prompt: string, chatID: string): Promise<{ response: string; chatID: string } | null> {
  try {
    const res = await fetch("http://localhost:3001/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ prompt, chatID }),
    });

    if (!res.ok) {
      throw new Error(`Send message failed with status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Send message response:", data);
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

export function ChatHandler({ chatId }: ChatHandlerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [chatTitle, setChatTitle] = useState<string | undefined>(undefined); // New state for chatTitle
  const [loading, setLoading] = useState(false); // For initial fetch
  const [isSending, setIsSending] = useState(false); // For sending messages
  const [isNotFound, setIsNotFound] = useState(false);

  // Load initial chat data when chatId changes
  useEffect(() => {
    if (chatId !== "new") {
      const fetchChat = async () => {
        setLoading(true);
        const chatData = await getChatData(chatId);
        if (chatData && chatData.chatHistory) {
          setMessages(chatData.chatHistory);
          setCurrentChatId(chatData.chatID);
          setChatTitle(chatData.chatTitle); 
        } else {
          setIsNotFound(true);
        }
        setLoading(false);
      };
      fetchChat();
    } else {
      setMessages([]);
      setCurrentChatId(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    document.title = `${chatTitle} | CryoRepository AI` || "New Chat | CryoRepository AI"; // Default to "New Chat" if undefined
  }, [chatTitle]);

  // Handle message submission
  const handleSubmit = async () => {    
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    // Check minimum character limit
    if (trimmedInput.length < 12) {
      toast.error("Message must be at least 12 characters long.", {
        duration: 3000, // Show for 3 seconds
      });
      return;
    }

    const newMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      _id: Math.random().toString(36).substring(2),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsSending(true); // Start sending state

    const data = await sendMessage(input, currentChatId);
    if (data) {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
        _id: Math.random().toString(36).substring(2),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentChatId(data.chatID);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Failed to get response", timestamp: new Date().toISOString(), _id: Math.random().toString(36).substring(2) },
      ]);
    }

    setIsSending(false); // End sending state
  };

  if (isNotFound) {
    return (
      <div className="w-full h-screen flex items-center justify-center mx-auto">
        <h3 className="text-xl font-semibold">Chat Not Found</h3>
      </div>
    );
  }

  return (
    <>
      <MessageHandler messages={messages} isSending={isSending} />
      <AiTextbox
        value={input}
        onChange={(value: string) => setInput(value)}
        onSubmit={handleSubmit}
        placeholder="Ask about cryopreservation (e.g. DMSO vs. Glycerol)..."
        className="w-full"
        disabled={loading || isSending} // Disable during fetch or send
      />
      <Toaster />
    </>
  );
}*/

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { AiTextbox } from "@/components/chat/textbox-component";
import { MessageHandler } from "@/components/chat/message-handler";
import { Toaster, toast } from "sonner"; // Using sonner as per your working handler
import { PromptButtons } from "@/components/chat/home-buttons"; // Import PromptButtons from home page
import { useAuth } from "@/lib/AuthContext"; // Import useAuth


// Define the chat message interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  _id: string;
}

interface SendMessageResponse {
  response?: string;
  chatID?: string;
  status?: number; // HTTP status code on error
  error?: string;  // Error message on failure
}

// Define props interface for the component
interface ChatHandlerProps {
  chatId: string;
}

// Interface for fetched chat data
interface ArticleData {
  chatID: string;
  chatTitle?: string;
  chatHistory: { role: "user" | "assistant"; content: string; timestamp: string; _id: string }[];
}

// Fetch chat data from the server
async function getChatData(chatID: string): Promise<ArticleData | null> {
  try {
    const res = await fetch(`http://localhost:3001/fetchChat/${chatID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.log(`Fetch failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    console.log("Fetched chat data:", data);
    return data as ArticleData;
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return null;
  }
}

/*
// Send a message to the server
async function sendMessage(prompt: string, chatID: string): Promise<{ response: string; chatID: string } | null> {
  try {
    const res = await fetch("http://localhost:3001/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ prompt, chatID }),
    });

    if (!res.ok) {
      throw new Error(`Send message failed with status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Send message response:", data);
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}*/

async function sendMessage(prompt: string, chatID: string): Promise<SendMessageResponse> {
  try {
    const res = await fetch("http://localhost:3001/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ prompt, chatID }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Fallback if no JSON
      return {
        status: res.status,
        error: errorData.error || `Send message failed with status: ${res.status}`,
      };
    }

    const data = await res.json();
    console.log("Send message response:", data);
    return data; // { response, chatID }
  } catch (error) {
    console.error("Error sending message:", error);
    return { status: 0, error: "Network error or server unreachable" };
  }
}

export function ChatHandler({ chatId }: ChatHandlerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [chatTitle, setChatTitle] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const router = useRouter();
  const { refreshChats } = useAuth();

  // Load initial chat data when chatId changes
  useEffect(() => {
    if (chatId !== "new") {
      const fetchChat = async () => {
        setLoading(true);
        const chatData = await getChatData(chatId);
        if (chatData && chatData.chatHistory) {
          setMessages(chatData.chatHistory);
          setCurrentChatId(chatData.chatID);
          setChatTitle(chatData.chatTitle);
        } else {
          setIsNotFound(true);
        }
        setLoading(false);
      };
      fetchChat();
    } else {
      setMessages([]);
      setCurrentChatId(chatId);
      setChatTitle(undefined); // Ensure title is unset for new chat
    }
  }, [chatId]);

  // Update document title when chatTitle changes
  useEffect(() => {
    document.title = chatTitle ? `${chatTitle} | CryoRepository AI` : "New Chat | CryoRepository AI";
  }, [chatTitle]);

  // Handler for when a prompt button is clicked
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  // Handle message submission
  const handleSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    // Check minimum character limit
    if (trimmedInput.length < 12) {
      toast.error("Message must be at least 12 characters long.", {
        duration: 3000,
      });
      return;
    }

    const newMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      _id: Math.random().toString(36).substring(2),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsSending(true);

    const data = await sendMessage(input, currentChatId);
    //if (data) {
    if (data.response && data.chatID) {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
        _id: Math.random().toString(36).substring(2),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentChatId(data.chatID);

      await refreshChats();

      router.push(`/chat/${data.chatID}`, { scroll: false });
    } else if (data.status === 401) {
      console.log("unauth");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Please login to use the service", timestamp: new Date().toISOString(), _id: Math.random().toString(36).substring(2) },
      ]);
    } else {
      console.log(data.status);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Failed to get response", timestamp: new Date().toISOString(), _id: Math.random().toString(36).substring(2) },
      ]);
    }

    setIsSending(false);
  };

  // Conditional rendering
  if (isNotFound) {
    return (
      <div className="w-full h-screen flex items-center justify-center mx-auto">
        <h3 className="text-xl font-semibold">Chat Not Found</h3>
      </div>
    );
  }

  if (chatId === "new" && messages.length === 0) {
    return (
      <div className="h-screen flex flex-col">
        <div className="w-full h-[calc(100vh-72.5px)] flex flex-col gap-4 items-center justify-center mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-semibold">New Chat</h1>
            <h3 className="font-semibold clip-bg">CryoRepository AI</h3>
          </div>
          <PromptButtons onPromptClick={handlePromptClick} />
        </div>
        <AiTextbox
          value={input}
          onChange={(value: string) => setInput(value)}
          onSubmit={handleSubmit}
          placeholder="Ask about cryopreservation (e.g. DMSO vs. Glycerol)..."
          className="w-full"
          disabled={loading || isSending}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <MessageHandler messages={messages} isSending={isSending} />
      <AiTextbox
        value={input}
        onChange={(value: string) => setInput(value)}
        onSubmit={handleSubmit}
        placeholder="Ask about cryopreservation (e.g. DMSO vs. Glycerol)..."
        className="w-full"
        disabled={loading || isSending}
      />
      <Toaster />
    </>
  );
}