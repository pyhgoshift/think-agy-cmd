"use client";

import { useState, useEffect } from "react";
import { History, Smartphone, Monitor } from "lucide-react";
import { motion } from "framer-motion";

interface HistoryItem {
  timestamp?: string;
  date?: string;
  time?: string;
  query?: string;
  status?: string;
  content?: string;
  agent?: string;
  action?: string;
  details?: string;
  source?: string;
  command?: string;
  work?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "always_allow" })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.history && Array.isArray(data.history)) {
            setHistory(data.history);
          }
        }
      } catch (error) {
        console.error("History fetch error:", error);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 max-h-screen">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <History className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-white tracking-wide">HISTORY</h1>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 flex flex-col min-h-0 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 pb-4">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-500">
              No history available
            </div>
          ) : (
            history.map((item, index) => {
              const displayTime = item.timestamp || (item.date ? `${item.date} ${item.time}` : "Unknown Time");
              const isStructured = !!item.command;
              
              // Fallbacks for old simple logs
              const displayCommand = item.command || item.query || item.action || "No command specified";
              const displayWork = item.work || item.content || item.details || "No work details provided";
              
              const isMobile = item.source === "MOBILE";
              const isIDE = item.source === "IDE";

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
                  className="bg-zinc-800/60 p-5 rounded-2xl border border-zinc-700/50 hover:border-primary/40 hover:bg-zinc-800/90 transition-all shrink-0 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                      <Clock size={12} className="text-zinc-500" />
                      {displayTime}
                    </span>
                    
                    {isStructured ? (
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider ${
                        isMobile ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        isIDE ? 'bg-primary/10 text-primary border border-primary/20' :
                        'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}>
                        {isMobile && <Smartphone size={12} />}
                        {isIDE && <Monitor size={12} />}
                        {item.source || "UNKNOWN"}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-700 text-zinc-400">
                        LEGACY
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-white text-sm font-semibold mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                      Command
                    </h3>
                    <p className="text-zinc-300 text-sm whitespace-pre-wrap pl-3.5 leading-relaxed">{displayCommand}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-zinc-700/50">
                    <h3 className="text-white text-sm font-semibold mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      Work
                    </h3>
                    <p className="text-zinc-400 text-sm whitespace-pre-wrap pl-3.5 leading-relaxed">{displayWork}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// Add Clock to imports since we use it above but didn't import it.
import { Clock } from "lucide-react";
