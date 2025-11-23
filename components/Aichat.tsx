"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Loader2,
  BotMessageSquare,
  CircleStop,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DefaultChatTransport } from "ai";
import { chatMessages } from "@/app/api/seo-chat/route";
import MarkdownType from "./MarkdownType";
import { useOnInView } from "react-intersection-observer";

export default function AIChat({ seoReportId }: { seoReportId: string }) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  //ai sdk messages
  const { messages, sendMessage, status, stop } = useChat<chatMessages>({
    transport: new DefaultChatTransport({
      api: "/api/seo-chat",
      body: { seoReportId },
    }),
  });

  //elements ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  //bottom scroll tracker
  const inViewRef = useOnInView((inView) => {
    if (inView) {
      setScrollDown(false);
    } else {
      setScrollDown(true);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If popup is open AND clicked outside chat box AND outside toggle button
      if (
        isExpanded &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        !toggleRef.current?.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const isTyping = status === "submitted";

  return (
    <>
      {/* Chat Widget */}
      {isExpanded && (
        <div ref={chatRef} className="fixed bottom-8 right-10 z-50 w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-primary to-secondary text-white rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">AI SEO Assistant</h3>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isTyping ? "bg-yellow-300 animate-pulse" : "bg-green-300"
                    )}
                  ></div>
                  <p className="text-xs text-indigo-100">
                    {isTyping ? "Thinking..." : "Online"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-4 relative"
          >
            {scrollDown && (
              <button
                onClick={scrollToBottom}
                className="sticky cursor-pointer top-65 left-80 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-gray-100 transition"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            )}

            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                👋 Hi! Ask me anything about your SEO report.
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm",
                    message.role === "user"
                      ? "bg-linear-to-r from-primary to-secondary text-white rounded-br-md"
                      : "bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-md"
                  )}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === "tool-web_search") {
                      switch (part.state) {
                        case "input-streaming":
                        case "input-available":
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Searching the web...</span>
                            </div>
                          );
                        case "output-available":
                          return (
                            <div key={`${message.id}-${i}`}>
                              <div className="text-sm text-green-600 font-medium">
                                ✓ Finished web search
                              </div>
                              <MarkdownType>
                                {part.output as string}
                              </MarkdownType>
                            </div>
                          );
                        case "output-error":
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="text-sm text-red-600"
                            >
                              ✗ Web search failed: {part.errorText}
                            </div>
                          );
                      }
                    }
                    if (part.type === "text") {
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="leading-relaxed"
                        >
                          <MarkdownType>{part.text}</MarkdownType>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-primary" />
                    <span className="text-sm text-gray-600">
                      AI is Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            <div ref={inViewRef} />
          </div>

          {/* Input */}
          <div className="p-5 border-t border-gray-100 bg-gray-50/50">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your SEO report..."
                className="flex-1 h-11 bg-white border-gray-200 rounded-xl focus-visible:ring-primary border-0 focus-visible:ring-2"
                disabled={isTyping}
              />
              {status != "streaming" ? (
                <Button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="h-11 w-12 bg-linear-to-r from-primary flex items-center justify-center to-secondary rounded-xl shadow-sm"
                >
                  <Send className="scale-125" />
                </Button>
              ) : (
                <Button
                  className="h-11 w-12  flex items-center justify-center bg-destructive rounded-xl shadow-sm"
                  onClick={stop}
                >
                  <CircleStop className="scale-125 text-white" />
                </Button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="fixed -bottom-6 right-6 z-50">
        <Button
          ref={toggleRef}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-700 to-secondary-foreground shadow-xl hover:shadow-indigo-500/25 transition-all duration-500 hover:scale-105 relative flex items-center justify-center"
        >
          {/* Bot icon */}
          <BotMessageSquare
            className={`
      absolute transition-all duration-300 
      ${isExpanded ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"}
      text-white scale-150
    `}
          />

          <X
            className={`
      absolute transition-all duration-300 
      ${isExpanded ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"}
      text-white scale-150
    `}
          />
        </Button>
      </div>
    </>
  );
}
