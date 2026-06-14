"use client";

import { useState, useEffect } from "react";
import { History } from "lucide-react";
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
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-500">
              No history available
            </div>
          ) : (
            history.map((item, index) => {
              const displayTime = item.timestamp || (item.date ? `${item.date} ${item.time}` : "Unknown Time");
              const displayContent = item.action || item.content || item.query || "No details";
              const displayStatus = item.status || (item.agent ? item.agent : "completed");

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
                  className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700/50 hover:border-primary/50 transition-colors shrink-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-zinc-400 font-mono">{displayTime}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      displayStatus === 'error' ? 'bg-red-500/10 text-red-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {displayStatus}
                    </span>
                  </div>
                  <p className="text-zinc-200 text-sm whitespace-pre-wrap">{displayContent}</p>
                  {item.details && (
                    <p className="text-zinc-400 text-xs mt-2 border-t border-zinc-700 pt-2">{item.details}</p>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
