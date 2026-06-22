"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState<{ id: number; text: string; role: "user" | "ai" }[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Speech Recognition API
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize SpeechRecognition if available
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true; // Keep listening even if user pauses
        reco.interimResults = true;
        reco.lang = "ko-KR"; // Default to Korean

        reco.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInputValue(currentTranscript);
        };

        reco.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      setInputValue(""); // Clear before speaking
      recognition?.start();
      setIsListening(true);
    }
  };

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
              let newMessages = [...prev];
              let shouldClear = false;
              
              data.outbound.forEach((msg: string) => {
                if (msg.includes("[CLEAR_SCREEN]")) {
                  shouldClear = true;
                } else {
                  newMessages.push({ id: Date.now() + Math.random(), text: msg, role: "ai" });
                }
              });
              
              if (shouldClear) {
                localStorage.removeItem("chat_history");
                return [];
              }
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
    
    // Stop listening if sending
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    }
    
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
    <div className="flex flex-col h-full bg-zinc-950 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6 shrink-0 pt-2">
        <MessageSquare className="text-primary" size={24} />
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">CHAT</h1>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 flex flex-col min-h-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 p-4 pb-6">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[85%] px-4 py-3 shadow-sm shrink-0 ${
                msg.role === "user" 
                  ? "self-end bg-primary text-white rounded-2xl rounded-tr-sm"
                  : "self-start bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm border border-zinc-700/50"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Bottom Input Area */}
        <div className="p-3 md:p-4 bg-zinc-900/95 border-t border-zinc-800/50 shrink-0">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            {recognition && (
              <button
                onClick={toggleListening}
                className={`p-3.5 rounded-xl shrink-0 flex items-center justify-center transition-all ${
                  isListening 
                    ? "bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse" 
                    : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500"
                }`}
                title="Voice Input"
              >
                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
            )}
            
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "듣고 있습니다..." : "명령을 입력하거나 음성 버튼을 누르세요"} 
              className="flex-1 min-w-0 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors shadow-lg"
            />
            
            <button 
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className={`shrink-0 px-5 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center ${
                inputValue.trim() 
                  ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" 
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
