"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { aiAPI } from "@/lib/api";
import type { ChatMessage } from "@/types";

const SUGGESTED_PROMPTS = [
  "How much did I sell today?",
  "Which products are low in stock?",
  "Who is my highest spending customer?",
  "Forecast next month's sales",
  "Generate an Instagram promotion",
  "Show high-risk customers",
];

export default function AIAssistant() {
  const { setAIOpen } = useSidebarStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your BusinessOS AI assistant. I can help you with inventory, sales, customers, forecasting, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await aiAPI.chat(messageText);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.message,
        agent: res.data.agent_used,
        tools_called: res.data.tools_called,
        data: res.data.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process your request. Make sure the backend server is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-[400px] bg-white border-l border-[rgba(0,0,0,0.06)] shadow-[-20px_0_60px_rgba(0,0,0,0.05)] flex flex-col z-50"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827]">AI Assistant</h3>
            <p className="text-[11px] text-[#10B981] font-medium">● Online</p>
          </div>
        </div>
        <button
          onClick={() => setAIOpen(false)}
          className="w-8 h-8 rounded-lg hover:bg-[#F9F7F4] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${
                  msg.role === "user"
                    ? "bg-[#111827]"
                    : "bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B]"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[280px] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#111827] text-white rounded-tr-md"
                    : "bg-[#F9F7F4] text-[#111827] rounded-tl-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.agent && msg.agent !== "general" && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="px-2 py-0.5 bg-[#FF6A3D]/10 rounded-md text-[10px] font-semibold text-[#FF6A3D]">
                      {msg.agent} agent
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6A3D] to-[#FF8F6B] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3 bg-[#F9F7F4] rounded-2xl rounded-tl-md">
              <Loader2 className="w-4 h-4 text-[#FF6A3D] animate-spin" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[11px] font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Suggested</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1.5 bg-[#F9F7F4] hover:bg-[#FF6A3D]/10 text-[#6B7280] hover:text-[#FF6A3D] text-xs rounded-lg transition-colors border border-[rgba(0,0,0,0.06)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-[rgba(0,0,0,0.06)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your business..."
            className="flex-1 px-4 py-3 bg-[#F9F7F4] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none border border-[rgba(0,0,0,0.06)] focus:border-[#FF6A3D]/30 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-[#FF6A3D] text-white flex items-center justify-center hover:bg-[#E85A2D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
