"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState<{ id: number; text: string; role: "user" | "ai" }[]>([
    { id: Date.now(), text: "시스템 초기화가 완료되었습니다. 무엇을 도와드릴까요?", role: "ai" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync with backend every 2 seconds
  useEffect(() => {
    const fetchSync = async () => {
      try {
        const response = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "always_allow" })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.outbound && Array.isArray(data.outbound) && data.outbound.length > 0) {
            setMessages(prev => {
              const newMessages = [...prev];
              data.outbound.forEach((msg: string) => {
                newMessages.push({ id: Date.now() + Math.random(), text: msg, role: "ai" });
              });
              return newMessages;
            });
          }
        }
      } catch (error) {
        console.error("Sync error:", error);
      }
    };

    const interval = setInterval(fetchSync, 2000);
    fetchSync(); // Initial fetch

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const messageText = inputValue.trim();
    setInputValue("");
    
    // Add user message immediately
    setMessages(prev => [...prev, { id: Date.now(), text: messageText, role: "user" }]);

    try {
      await fetch("/api/msg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "always_allow", message: messageText })
      });
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 max-h-screen">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <MessageSquare className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-white tracking-wide">CHAT</h1>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 p-4 pb-6">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[80%] px-4 py-3 shadow-sm shrink-0 ${
                msg.role === "user" 
                  ? "self-end bg-primary text-white rounded-2xl rounded-tr-sm"
                  : "self-start bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm border border-zinc-700/50"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-zinc-900/95 border-t border-zinc-800/50 shrink-0">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="명령을 입력하세요..." 
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors shadow-lg"
            />
            <button 
              onClick={sendMessage}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 flex items-center justify-center shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
