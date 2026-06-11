"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function GraphPage() {
  const [graphUrl, setGraphUrl] = useState<string | null>(null);

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
          if (data.graph_url) {
            setGraphUrl(data.graph_url);
          }
        }
      } catch (error) {
        console.error("Sync error:", error);
      }
    };
    fetchSync();
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <Share2 className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-white tracking-wide">SYSTEM GRAPH</h1>
      </div>
      
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden relative">
        {graphUrl ? (
          <iframe 
            src={graphUrl} 
            className="absolute inset-0 w-full h-full border-none"
            title="System Graph"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            Loading graph...
          </div>
        )}
      </div>
    </div>
  );
}
