"use client";

import { useState, useEffect } from "react";
import { History } from "lucide-react";
import { motion } from "framer-motion";

interface HistoryItem {
  timestamp: string;
  query: string;
  status: string;
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
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <History className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-white tracking-wide">HISTORY</h1>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 overflow-y-auto no-scrollbar">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            No history available
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-zinc-400 font-mono">{item.timestamp}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'success' ? 'bg-green-500/10 text-green-400' :
                    item.status === 'error' ? 'bg-red-500/10 text-red-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {item.status || 'completed'}
                  </span>
                </div>
                <p className="text-zinc-200 text-sm">{item.query}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
