"use client";
/*
import { useEffect, useRef } from "react";

// Define the chat message interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  _id: string;
}

// Define props interface for the component
interface ChatHandlerProps {
  messages: ChatMessage[];
  isSending: boolean; // New prop to track sending state
}

// Enhanced Markdown parser returning an array of HTML fragments
function parseMarkdownText(text: string): { type: string; content: string }[] {
  const lines = text.split("\n");
  let inList = false;
  const fragments: { type: string; content: string }[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("* ")) {
      if (!inList) {
        fragments.push({ type: "ul_open", content: "<ul>" });
        inList = true;
      }
      const content = trimmedLine.slice(2).trim();
      const processedContent = content*/
      //  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      //  .replace(/\*(.*?)\*/g, "<em>$1</em>");
      /*fragments.push({ type: "li", content: `<li>${processedContent}</li>` });
    } else {
      if (inList) {
        fragments.push({ type: "ul_close", content: "</ul>" });
        inList = false;
      }
      const processedLine = line*/
      //  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      //  .replace(/\*(.*?)\*/g, "<em>$1</em>");
      /*fragments.push({
        type: "p",
        content: processedLine || "<br />",
      });
    }
  });

  if (inList) {
    fragments.push({ type: "ul_close", content: "</ul>" });
  }

  return fragments;
}

export function MessageHandler({ messages, isSending }: ChatHandlerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="mx-auto px-[20px] mt-[68.5px] mb-[72.5px] max-w-[970px]">
      <div className="flex flex-col gap-[15px] py-[50px] overflow-y-auto max-h-full scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`py-[10px] px-[15px] rounded-xl max-w-[70%] ${
              message.role === "user"
                ? "self-end border border-[var(--sidebar-border)] bg-[var(--sidebar)]"
                : "self-start"
            }`}
          >
            <div className="mb-[5px]">
              <p className="font-semibold mr-[5px]">
                {message.role === "user" ? "You" : "AI"}:
              </p>
              <div>
                {parseMarkdownText(message.content).map((fragment, index) => (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: fragment.content }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="self-start py-[10px] px-[15px] rounded-xl max-w-[70%]">
            <div className="mb-[5px] flex items-center gap-2">
              <p className="font-semibold mr-[5px]">AI:</p>
              <span className="relative flex size-3">
               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--foreground) opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-(--input)"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
      </div>
    </div>
  );
}*/

"use client";
import { useEffect, useRef } from "react";

// Define the chat message interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  _id: string;
}

// Define props interface for the component
interface ChatHandlerProps {
  messages: ChatMessage[];
  isSending: boolean;
}

// Enhanced Markdown parser returning an array of HTML fragments
function parseMarkdownText(text: string): { type: string; content: string }[] {
  const lines = text.split("\n");
  let inList = false;
  const fragments: { type: string; content: string }[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("* ")) {
      if (!inList) {
        fragments.push({ type: "ul_open", content: "<ul>" });
        inList = true;
      }
      const content = trimmedLine.slice(2).trim();
      const processedContent = content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      fragments.push({ type: "li", content: `<li>${processedContent}</li>` });
    } else {
      if (inList) {
        fragments.push({ type: "ul_close", content: "</ul>" });
        inList = false;
      }
      const processedLine = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      fragments.push({
        type: "p",
        content: processedLine || "<br />",
      });
    }
  });

  if (inList) {
    fragments.push({ type: "ul_close", content: "</ul>" });
  }

  return fragments;
}

export function MessageHandler({ messages, isSending }: ChatHandlerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="mx-auto px-[20px] mt-[68.5px] mb-[72.5px] max-w-[970px]">
      <div className="flex flex-col gap-[15px] py-[50px] overflow-y-auto max-h-full scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`py-[10px] px-[15px] rounded-xl max-w-[70%] ${
              message.role === "user"
                ? "self-end border border-[var(--sidebar-border)] bg-[var(--sidebar)]"
                : "self-start animate-assistant-message"
            }`}
          >
            <div className="mb-[5px]">
              <p className="font-semibold mr-[5px]">
                {message.role === "user" ? "You" : "AI"}:
              </p>
              <div>
                {parseMarkdownText(message.content).map((fragment, index) => (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: fragment.content }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        {/* Loading div when sending a message */}
        {isSending && (
          <div className="self-start py-[10px] px-[15px] rounded-xl max-w-[70%]">
            <div className="mb-[5px] flex items-center gap-2">
              <p className="font-semibold mr-[5px]">AI:</p>
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--foreground)] opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-[var(--input)]"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
      </div>
    </div>
  );
}